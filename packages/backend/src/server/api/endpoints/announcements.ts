import { Inject, Injectable } from '@nestjs/common';
import { Endpoint } from '@/server/api/endpoint-base.js';
import { QueryService } from '@/core/QueryService.js';
import { DI } from '@/di-symbols.js';
import type { AnnouncementReadsRepository, AnnouncementsRepository, UsersRepository } from '@/models/index.js';

export const meta = {
	tags: ['meta'],

	requireCredential: false,

	res: {
		type: 'array',
		optional: false, nullable: false,
		items: {
			type: 'object',
			optional: false, nullable: false,
			properties: {
				id: {
					type: 'string',
					optional: false, nullable: false,
					format: 'id',
					example: 'xxxxxxxxxx',
				},
				createdAt: {
					type: 'string',
					optional: false, nullable: false,
					format: 'date-time',
				},
				updatedAt: {
					type: 'string',
					optional: false, nullable: true,
					format: 'date-time',
				},
				text: {
					type: 'string',
					optional: false, nullable: false,
				},
				title: {
					type: 'string',
					optional: false, nullable: false,
				},
				imageUrl: {
					type: 'string',
					optional: false, nullable: true,
				},
				isRead: {
					type: 'boolean',
					optional: true, nullable: false,
				},
				userId: {
					type: 'boolean',
					optional: false, nullable: true,
				},
				user: {
					type: 'object',
					optional: false, nullable: true,
				}
			},
		},
	},
} as const;

export const paramDef = {
	type: 'object',
	properties: {
		limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
		withUnreads: { type: 'boolean', default: false },
		sinceId: { type: 'string', format: 'misskey:id' },
		untilId: { type: 'string', format: 'misskey:id' },
		privateOnly: { type: 'boolean', default: false },
	},
	required: [],
} as const;

// eslint-disable-next-line import/no-default-export
@Injectable()
export default class extends Endpoint<typeof meta, typeof paramDef> {
	constructor(
		@Inject(DI.announcementsRepository)
		private announcementsRepository: AnnouncementsRepository,

		@Inject(DI.announcementReadsRepository)
		private announcementReadsRepository: AnnouncementReadsRepository,
		
		@Inject(DI.usersRepository)
		private usersRepository: UsersRepository,

		private queryService: QueryService,
	) {
		super(meta, paramDef, async (ps, me) => {
			const builder = this.announcementsRepository.createQueryBuilder('announcement');
			if (me) {
				if (ps.privateOnly) {
					builder.where({ userId: me.id });
				} else {
					builder.where('"userId" IS NULL');
					builder.orWhere({ userId: me.id });
				}
			} else {
				builder.where('"userId" IS NULL');
			}

			const query = this.queryService.makePaginationQuery(builder, ps.sinceId, ps.untilId);
			const announcements = await query.take(ps.limit).getMany();

			if (me) {
				const reads = (await this.announcementReadsRepository.findBy({
					userId: me.id,
				})).map(x => x.announcementId);
				for (const announcement of announcements) {
					(announcement as any).isRead = reads.includes(announcement.id);
				}
			}

			const resultbase = (ps.withUnreads ? announcements.filter((a: any) => !a.isRead) : announcements).map((a) => ({
				...a,
				createdAt: a.createdAt.toISOString(),
				updatedAt: a.updatedAt?.toISOString() ?? null,
			}));
			for (let i = 0; i < resultbase.length; i++) {
				const r = resultbase[i];
				const userId = resultbase[i].userId;
				if (userId) {
					const user = await this.usersRepository.findOneBy({ id: userId });
					if (user) {
						r.user = user;
						resultbase[i] = r;
					}
				}
			}

			return resultbase;
		});
	}
}
