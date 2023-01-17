<template>
<div>
	<MkStickyContainer>
		<template #header><XHeader :actions="headerActions" :tabs="headerTabs"/></template>
		<MkSpacer :content-max="700">
			<div class="_gaps">
				<MkFolder ref="moderatorRoleFolder">
					<template #label>{{ i18n.ts._roleQuick.moderatorRole }}</template>
					<MkInput v-model="moderatorRoleName">
						<template #label>{{ i18n.ts._role.name }}</template>
					</MkInput>
				</MkFolder>

				<MkFolder>
					<template #label>a</template>
				</MkFolder>
			
				<MkSwitch v-model="canEditMembersByModerator">
					<template #label>{{ i18n.ts._role.canEditMembersByModerator }}</template>
					<template #caption>{{ i18n.ts._role.descriptionOfCanEditMembersByModerator }}</template>
				</MkSwitch>

				<MkSwitch v-model="isPublic">
					<template #label>{{ i18n.ts._role.isPublic }}</template>
					<template #caption>{{ i18n.ts._role.descriptionOfIsPublic }}</template>
				</MkSwitch>
			
				<MkButton primary rounded @click="save"><i class="ti ti-check"></i> {{ i18n.ts.create }}</MkButton>
			</div>
		</MkSpacer>
	</MkStickyContainer>
</div>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue';
import XHeader from './_header_.vue';
import MkInput from '@/components/MkInput.vue';
import MkSelect from '@/components/MkSelect.vue';
import MkPagination from '@/components/MkPagination.vue';
import MkFolder from '@/components/MkFolder.vue';
import MkSwitch from '@/components/MkSwitch.vue';
import MkButton from '@/components/MkButton.vue';
import MkRange from '@/components/MkRange.vue';
import MkRolePreview from '@/components/MkRolePreview.vue';
import * as os from '@/os';
import { i18n } from '@/i18n';
import { definePageMetadata } from '@/scripts/page-metadata';
import { instance } from '@/instance';
import { useRouter } from '@/router';

const ROLE_POLICIES = [
	'gtlAvailable',
	'ltlAvailable',
	'canPublicNote',
	'canInvite',
	'canManageCustomEmojis',
	'canHideAds',
	'driveCapacityMb',
	'pinLimit',
	'antennaLimit',
	'wordMuteLimit',
	'webhookLimit',
	'clipLimit',
	'noteEachClipsLimit',
	'userListLimit',
	'userEachUserListsLimit',
	'rateLimitFactor',
] as const;

const policies = reactive<Record<typeof ROLE_POLICIES[number], any>>({});
for (const ROLE_POLICY of ROLE_POLICIES) {
	policies[ROLE_POLICY] = instance.policies[ROLE_POLICY];
}

const moderatorRoleFolder = $ref();
const moderatorRoleName = $ref('');

const canEditMembersByModerator = $ref(false);
const isPublic = $ref(false);

const headerActions = $computed(() => []);

const headerTabs = $computed(() => []);

async function save() {

}

definePageMetadata(computed(() => ({
	title: i18n.ts.rolesQuickNew,
	icon: 'ti ti-badges',
})));
</script>

<style lang="scss" module>

</style>
