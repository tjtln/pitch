build:
	sam build

deploy:
	sam deploy

install-create-game:
	cd create-game && npm i

install-deal-hands:
	cd deal-hands && npm i

install-get-hand:
	cd get-hand && npm i

install-get-dealer:
	cd get-dealer && npm i

install-set-dealer:
	cd set-dealer && npm i

install-set-scores:
	cd set-scores && npm i

install-get-scores:
	cd get-scores && npm i

install-set-turn:
	cd set-turn && npm i

install-get-turn:
	cd get-turn && npm i

install-set-played:
	cd set-played && npm i

install-get-played:
	cd get-played && npm i

install-get-phase:
	cd get-phase && npm i

install-set-phase:
	cd set-phase && npm i

install-get-bid:
	cd get-bid && npm i

install-set-bid:
	cd set-bid && npm i

install-get-players:
	cd get-players && npm i

install-all: install-create-game install-deal-hands install-get-hand install-get-dealer install-set-dealer install-set-scores install-get-scores install-set-turn install-get-turn install-set-played install-get-played install-get-phase install-set-phase install-get-bid install-set-bid install-get-players

compile-create-game:
	cd create-game && npm run compile

compile-deal-hands:
	cd deal-hands && npm run compile

compile-get-hand:
	cd get-hand && npm run compile

compile-get-dealer:
	cd get-dealer && npm run compile

compile-set-dealer:
	cd set-dealer && npm run compile

compile-set-scores:
	cd set-scores && npm run compile

compile-get-scores:
	cd get-scores && npm run compile

compile-set-turn:
	cd set-turn && npm run compile

compile-get-turn:
	cd get-turn && npm run compile

compile-set-played:
	cd set-played && npm run compile

compile-get-played:
	cd get-played && npm run compile

compile-get-phase:
	cd get-phase && npm run compile

compile-set-phase:
	cd set-phase && npm run compile

compile-get-bid:
	cd get-bid && npm run compile

compile-set-bid:
	cd set-bid && npm run compile

compile-get-players:
	cd get-players && npm run compile


compile-all: compile-create-game compile-deal-hands compile-get-hand compile-get-dealer compile-set-dealer compile-set-scores compile-get-scores compile-set-turn compile-get-turn compile-set-played compile-get-played compile-get-phase compile-set-phase compile-get-bid compile-set-bid compile-get-players

invoke-create-game: compile-create-game build
	sam local invoke CreateGameFunction --event events/createGame.json

invoke-deal-hands: compile-deal-hands build
	sam local invoke DealHandsFunction --event events/dealHands.json

invoke-get-hand: compile-get-hand build
	sam local invoke GetHandFunction --event events/getHand.json

invoke-get-dealer: compile-get-dealer build
	sam local invoke GetDealerFunction --event events/getDealer.json

invoke-set-dealer: compile-set-dealer build
	sam local invoke SetDealerFunction --event events/setDealer.json

invoke-set-scores: compile-set-scores build
	sam local invoke SetScoresFunction --event events/setScores.json

invoke-get-scores: compile-get-scores build
	sam local invoke GetScoresFunction --event events/getScores.json

invoke-set-turn: compile-set-turn build
	sam local invoke SetTurnFunction --event events/setTurn.json

invoke-get-turn: compile-get-turn build
	sam local invoke GetTurnFunction --event events/getTurn.json

invoke-set-played: compile-set-played build
	sam local invoke SetPlayedFunction --event events/setPlayed.json

invoke-get-played: compile-get-played build
	sam local invoke GetPlayedFunction --event events/getPlayed.json

invoke-get-phase: compile-get-phase build
	sam local invoke GetPhaseFunction --event events/getPhase.json

invoke-set-phase: compile-set-phase build
	sam local invoke SetPhaseFunction --event events/setPhase.json

invoke-get-bid: compile-get-bid build
	sam local invoke GetBidFunction --event events/getBid.json

invoke-set-bid: compile-set-bid build
	sam local invoke SetBidFunction --event events/setBid.json

invoke-get-players: compile-get-players build
	sam local invoke GetPlayersFunction --event events/getPlayers.json