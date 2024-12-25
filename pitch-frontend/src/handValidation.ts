import axios from "axios";

export async function isValid(card: string, gameId: string, name: string){
    const r1 = await isMyTurn(gameId, name);
    const r2 = await isPlayingPhase(gameId, name);
    const r3 = await isLegalCard(card, gameId, name);

    return r1 && r2 && r3;
}

async function isMyTurn(gameId: string, name: string){
    try {
        const response = await axios.get<string>(`https://zrxobwstga.execute-api.us-east-1.amazonaws.com/Prod/games/${gameId}/turn`);
        const turn = response.data;
        if(turn == name){
            return true;
        }
    } catch (e) {
        console.log(e);
        return false;
    }
}

async function isPlayingPhase(gameId: string, name: string){
    try {
        const response = await axios.get<string>(`https://zrxobwstga.execute-api.us-east-1.amazonaws.com/Prod/games/${gameId}/turn`);
        const turn = response.data;
        if(turn == name){
            return true;
        }
    } catch (e) {
        console.log(e);
        return false;
    }
}

async function isLegalCard(card: string, gameId: string, name: string){
    try {
        const response = await axios.get<string>(`https://zrxobwstga.execute-api.us-east-1.amazonaws.com/Prod/games/${gameId}/turn`);
        const turn = response.data;
        if(turn == name){
            return true;
        }
    } catch (e) {
        console.log(e);
        return false;
    }
}