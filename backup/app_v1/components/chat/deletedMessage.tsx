export const SOFT_DELETED_MESSAGES = [
    "Pesan telah dihapus",
    "Pesan telah dihapus"
] as const;

export const DEFAULT_SOFT_DELETED_TEXT = SOFT_DELETED_MESSAGES[0];
export const DEFAULT_FILE_DELETED_TEXT = SOFT_DELETED_MESSAGES[1];

export function isSoftDeletedMessage( text?: string ): boolean
{
    if ( !text ) return false;
    return SOFT_DELETED_MESSAGES.includes(
        text as typeof SOFT_DELETED_MESSAGES[number]
    );
}
