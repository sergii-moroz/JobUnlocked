// import { TwoFABackupGA } from "./components/2fa/2fa-backup-ga.js";
// import { TwoFADisableVerify } from "./components/2fa/2fa-disable-verify.js";
// import { TwoFALoginVerify } from "./components/2fa/2fa-login-verify.js";
// import { TwoFARegisterGA } from "./components/2fa/2fa-register-ga.js";
// import { TwoFAVerifyGA } from "./components/2fa/2fa-verify-ga.js";
// import { Button2FA } from "./components/2fa/button-2fa.js";
import { applicantList } from "./components/applicantList.js";
import { ButtonThemeToggle } from "./components/button-theme-toggle.js";
import { HomeHeader } from "./components/home-page/header.js";
import { HomePageParthner } from "./components/home-page/home-page-partner.js";
import { HomePageStudent } from "./components/home-page/home-page-student.js";
import { HomePageStuff } from "./components/home-page/home-page-stuff.js";
import { HomePage } from "./components/home-page/home-page.js";
// import { HomeContent } from "./components/home-sidebar/content.js";
// import { HomeHeader } from "./components/home-sidebar/header.js";
// import { PlayCard } from "./components/home-sidebar/play-card.js";
// import { Sidebar } from "./components/home-sidebar/sidebar.js";
// import { StatsCard } from "./components/home-sidebar/stats-card.js";
// import { TopPlayerCard } from "./components/home-sidebar/top-player-card.js";
// import { IconCheck } from "./components/icons/icon-check.js";
// import { IconChevronLeft } from "./components/icons/icon-chevron-left.js";
// import { IconHomeMultiplayer } from "./components/icons/icon-home-multiplayer.js";
// import { IconHomeSingleplayer } from "./components/icons/icon-home-single-player.js";
// import { IconHomeTournament } from "./components/icons/icon-home-tournament.js";
// import { IconShieldCheck } from "./components/icons/icon-shield-check.js";
// import { IconSquareArrowUpRight } from "./components/icons/icon-square-arrow-up-right.js";
// import { IconUserRound } from "./components/icons/icon-user-round.js";
import { LoginForm } from "./components/login-form.js";
import { ModalLoginMenu } from "./components/modal-login-menu.js";
import { JobOfferForm } from "./components/newJobOffer.js";
import { RegisterForm } from "./components/register-form.js";
import { ApplicationForm } from "./components/student-application.js";
import { Profile } from "./components/dashboard/profile.js";
// import { WaitingRoom } from "./components/waiting-room.js";
// import { GameRoom } from "./components/game.js";
// import { TournamentList } from "./components/tournament-list.js";
// import { Tournament } from "./components/tournament.js";
import { Router } from "./router.js";
// import { UserGameHistory } from "./components/history/user-game-history.js";
// import { UserGameHistory2 } from "./components/history/user-game-history2.js";
// import { GameHistoryData } from "./components/history/game-history-data.js";
// import { GameHistoryTabs } from "./components/history/game-history-tabs.js";

customElements.define('modal-login-menu', ModalLoginMenu)
customElements.define('btn-theme-toggle', ButtonThemeToggle)
// customElements.define('btn-2fa', Button2FA)

// // PAGE COMPONENTS
customElements.define('register-form', RegisterForm)
customElements.define('login-form', LoginForm)
customElements.define('home-page', HomePage)
customElements.define('home-page-stuff', HomePageStuff)
customElements.define('home-page-partner', HomePageParthner)
customElements.define('home-page-student', HomePageStudent)
customElements.define('profile-page', Profile)
// customElements.define('play-card', PlayCard)
// customElements.define('stats-card', StatsCard)
// customElements.define('top-player-card', TopPlayerCard)
// customElements.define('user-game-history', UserGameHistory)
// customElements.define('user-game-history2', UserGameHistory2)
// customElements.define('game-history-data', GameHistoryData)
// customElements.define('game-history-tabs', GameHistoryTabs)

// // 2FA
// customElements.define('two-fa-login-verify', TwoFALoginVerify)
// customElements.define('two-fa-register-ga', TwoFARegisterGA)
// customElements.define('two-fa-verify-ga', TwoFAVerifyGA)
// customElements.define('two-fa-backup-ga', TwoFABackupGA)
// customElements.define('two-fa-disable-verify', TwoFADisableVerify)

// // Home
customElements.define('home-header', HomeHeader);
// customElements.define('home-content', HomeContent);
// customElements.define('friends-sidebar', Sidebar);


// // ICONS
// customElements.define('icon-check', IconCheck)
// customElements.define('icon-chevron-left', IconChevronLeft)
// customElements.define('icon-shield-check', IconShieldCheck)
// customElements.define('icon-square-arrow-up-right', IconSquareArrowUpRight)
// customElements.define('icon-user-round', IconUserRound)
// customElements.define('icon-home-single-player', IconHomeSingleplayer)
// customElements.define('icon-home-multiplayer', IconHomeMultiplayer)
// customElements.define('icon-home-tournament', IconHomeTournament)

// // Waiting Room
// customElements.define('waiting-room', WaitingRoom)

// // Game
// customElements.define('game-room', GameRoom)

// // Tournament
// customElements.define('tournament-list', TournamentList)
// customElements.define('tournament-room', Tournament)
customElements.define('application-form', ApplicationForm);
customElements.define('job-offer-form', JobOfferForm);
customElements.define('applicant-list', applicantList);

Router.init()
