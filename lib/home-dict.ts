import type { Dictionary } from "@/get-dictionary";

// The slice of the dictionary the /home page (Client Components) needs
export const homeDict = (t: Dictionary) => ({
	header: {
		welcome: t.home.header.welcome,
		welcomeAnon: t.home.header.welcomeAnon,
		energy: t.home.header.energy,
		newCell: t.dialog.newCell.title,
	},
	slots: {
		title: t.sidebar.slots,
		empty: t.dashboard.legend.empty,
		emptySubtitle: t.empty.subtitle,
		newCell: t.dialog.newCell.title,
		expired: t.dashboard.expired,
		shown: t.shown,
		of: t.of,
		showMore: t.showMore,
		ended: t.ended,
		inprocess: t.inprocess,
		nolimit: t.nolimit,
		days: t.days,
		hours: t.hours,
		minutes: t.minutes,
		seconds: t.seconds,
		buyAgain: t.buyAgain,
	},
	popular: {
		title: t.home.popular.title,
		empty: t.home.popular.empty,
		like: t.like,
		unlike: t.unlike,
		authRequired: t.auth.required,
		likeNeedsLogin: t.auth.likeNeedsLogin,
		login: t.login,
		register: t.register,
	},
	info: {
		announcementsTitle: t.info.announcements.title,
		nextBroadcast: t.nextBroadcast,
		prevBroadcast: t.prevBroadcast,
		weekTopic: t.weekTopic,
		energyTitle: t.info.energy.title,
		energyBody: t.info.energy.body,
		shopTitle: t.info.shop.title,
		shopBody: t.info.shop.body,
		comingSoon: t.comingSoon,
		communityTitle: t.info.community.title,
		getInTouch: t.contact.getInTouch,
		settingsTitle: t.info.settings.title,
		settingsLink: t.info.settings.openLink,
	},
});

export type HomeDict = ReturnType<typeof homeDict>;
