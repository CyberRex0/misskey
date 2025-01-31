import * as Misskey from 'misskey-js';
import { UnicodeEmojiDef } from './emojilist.js';

export function checkReactionPermissions(me: Misskey.entities.MeDetailed, note: Misskey.entities.Note, emoji: Misskey.entities.EmojiSimple | UnicodeEmojiDef): boolean {
  if ('char' in emoji) return true; // UnicodeEmojiDefなら常にリアクション可能

  emoji = emoji as Misskey.entities.EmojiSimple;
  const roleIdsThatCanBeUsedThisEmojiAsReaction = emoji.roleIdsThatCanBeUsedThisEmojiAsReaction ?? [];
  return !(emoji.localOnly && note.user.host !== me.host)
      && !(emoji.isSensitive && (note.reactionAcceptance === 'nonSensitiveOnly' || note.reactionAcceptance === 'nonSensitiveOnlyForLocalLikeOnlyForRemote'))
      && (roleIdsThatCanBeUsedThisEmojiAsReaction.length === 0 || me.roles.some(role => roleIdsThatCanBeUsedThisEmojiAsReaction.includes(role.id)));
}
