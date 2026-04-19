import type { ApiClientFutureFlags, ApiRequestOptions } from "../apiClient/index.js";

export type ApiClientConfiguration = {
  baseURL?: string;
  /**
   * @deprecated Use `accessToken` instead.
   */
  secretKey?: string;
  /**
   * The access token to authenticate with the Trigger API.
   */
  accessToken?: string;
  /**
   * The preview branch name (for preview environments)
   */
  previewBranch?: string;
  /**
   * Pin or unpin task triggers in this scope. A string pins to that version,
   * `null` skips version locking (ignores TRIGGER_VERSION), undefined falls through.
   */
  version?: string | null;
  requestOptions?: ApiRequestOptions;
  future?: ApiClientFutureFlags;
};
