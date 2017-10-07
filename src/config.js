var CONST = {
  URL_BASE: 'https://reimu.worktile.com',
  URL_TASKNO_PREFIX: 'https://help.worktile.com/taskno/',
  URL_TASKCODE_PREFIX: 'https://help.worktile.com/taskcode/',
  URL_PUBLIC_IMAGE_PREFIX: 'https://help.worktile.com/public_image/',
  URL_TASK_ACTIVE: 'https://help.worktile.com/active',
  TEAM_ID: '5837fe300d084d66c710fd0e'
};

CONST.URL_API_COMMENT = CONST.URL_BASE + '/api/comment';
CONST.URL_API_CHAT = CONST.URL_BASE + '/api/team/chats';
CONST.URL_API_TASKNO = CONST.URL_BASE + '/api/tasks/no/';
CONST.URL_API_TASKCODE = CONST.URL_BASE + '/api/tasks/';
CONST.URL_API_MESSAGE = CONST.URL_BASE + '/api/pigeon/messages';
CONST.URL_API_READ_MESSAGE = CONST.URL_BASE + '/api/unreads/';
CONST.URL_API_TEAM = CONST.URL_BASE + '/api/team';
CONST.URL_API_TAGS = CONST.URL_BASE + '/api/tags';

var RCONST = {
  URL_WT_BASE: /^https:\/\/reimu\.worktile\.com/,
  URL_HWT_TASKNO: /^https:\/\/help.worktile.com\/taskno/,
  URL_HWT_TASKCODE: /^https:\/\/help.worktile.com\/taskcode/,
  URL_HWT_IMAGE: /^https:\/\/help.worktile.com\/image/,
  URL_HWT_PUBLIC_IMAGE: /^https:\/\/help.worktile.com\/public_image/,
  URL_HWT_ACTIVE: /^https:\/\/help.worktile.com\/active/
};
