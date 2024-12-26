import axios from "axios";

export async function createGame(player: string) {
    //TODO: check to make sure game does not exist
    try {
        const gameExists = await axios.get<PlayersResponse>(`https://zrxobwstga.execute-api.us-east-1.amazonaws.com/Prod/create-game`, body);

        const body = {
            players: [player]
        };
        const response = await axios.post<CreateGameResponse>(`https://zrxobwstga.execute-api.us-east-1.amazonaws.com/Prod/create-game`, body);
        const gameId = response.data.gameId;
        if(gameId != null) {
            return gameId
        } else {
            return "error";
        }
    } catch (e) {
        console.log(e);
    }
    return "error";
}

export async function joinGame(gameId: string, player: string){
    
}

type CreateGameResponse = {
    message: string,
    gameId: string
}

type PlayersResponse = {
    message: string,
    gameId: string
}