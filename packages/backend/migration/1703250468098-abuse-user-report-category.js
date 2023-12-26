/*
 * SPDX-FileCopyrightText: syuilo and other misskey contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export class AbuseUserReportCategory1703250468098 {
    name = 'AbuseUserReportCategory1703250468098'

    async up(queryRunner) {
			// abuse_user_reportにレコードがあった場合を想定して2段階
			await queryRunner.query(`ALTER TABLE "abuse_user_report" ADD "category" character varying(20)`);
			await queryRunner.query(`UPDATE "abuse_user_report" SET "category" = 'other'`);
			await queryRunner.query(`ALTER TABLE "abuse_user_report" ALTER "category" SET NOT NULL`);
	}

	async down(queryRunner) {
			await queryRunner.query(`ALTER TABLE "abuse_user_report" DROP COLUMN "category"`);
	}
}
