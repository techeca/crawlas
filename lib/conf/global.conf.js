import dofusConf from './games-conf/dofus-items.conf.js';
//import dofusTouchConf from './games-conf/dofus-touch-items.conf';
//import wakfuConf from './games-conf/wakfu-items.conf';
//import wavenConf from './games-conf/waven-items.conf';

import dofusListUrl from './games-list-url/dofus-list-url.js';
//import dofusTouchListUrl from './games-list-url/dofus-touch-list-url';
//import wakfuListUrl from './games-list-url/wakfu-list-url';
//import wavenListUrl from './games-list-url/waven-list-url';

export const gamesConf = {
	'games': {
		'dofus': {
			'conf': dofusConf,
			'active': true,
			'languages': {
				'french': dofusListUrl.urlSwitcherFr,
				'english': dofusListUrl.urlSwitcherEn,
        'spanish': dofusListUrl.urlSwitcherEs
			}
		},
		/*'dofus-touch': {
			'conf': dofusTouchConf,
			'active': true,
			'languages': {
				'french': dofusTouchListUrl.urlSwitcherFr,
				'english': dofusTouchListUrl.urlSwitcherEn,
        'spanish': dofusTouchListUrl.urlSwitcherEs
			}
		},
		'wakfu': {
			'conf': wakfuConf,
			'active': false,
			'languages': {
				'french': wakfuListUrl.urlSwitcherFr,
				'english': wakfuListUrl.urlSwitcherEn,
        'spanish': wakfuListUrl.urlSwitcherEs
			}
		},
		'waven': {
			'conf': wavenConf,
			'active': false,
			'languages': {
				'french': wavenListUrl.urlSwitcherFr,
				'english': wavenListUrl.urlSwitcherEn,
        'spanish': wavenListUrl.urlSwitcherEs
			}
		},*/
	},
};
