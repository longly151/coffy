export enum AccessControlList {
  ALL = 'ALL',
  /**
   * USER
   */
  USER_CREATE = 'USER_CREATE',
  USER_READ = 'USER_READ',
  USER_UPDATE = 'USER_UPDATE',
  USER_DELETE = 'USER_DELETE',
  USER_PERMANENTLY_DELETE = 'USER_PERMANENTLY_DELETE',
  SELF_USER_READ = 'SELF_USER_READ',
  SELF_USER_UPDATE = 'SELF_USER_UPDATE',
  SELF_USER_DELETE = 'SELF_USER_DELETE',
  SELF_USER_PERMANENTLY_DELETE = 'SELF_USER_PERMANENTLY_DELETE',
}
