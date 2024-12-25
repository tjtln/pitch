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

install-all: install-create-game install-deal-hands install-get-hand

compile-create-game:
	cd create-game && npm run compile

compile-deal-hands:
	cd create-game && npm run compile

compile-get-hand:
	cd create-game && npm run compile

compile-all: compile-create-game compile-deal-hands compile-get-hand

invoke-create-game: compile-create-game build
	sam local invoke CreateGameFunction --event events/createGame.json

invoke-deal-hands: compile-deal-hands build
	sam local invoke DealHandsFunction --event events/dealHands.json

invoke-get-hand: compile-get-hand build
	sam local invoke GetHandFunction --event events/getHand.json
