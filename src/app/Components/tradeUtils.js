export function roundNumber(number, decimals = 2){
    const decimV = 10**decimals;
    return Math.round(number  * decimV) / decimV;
}

export function calculateRiskOrder(capital, targetRisk, capInDealPercent, stopLossPercent, price, minAssetQty, assetQtyStep){
    const riskCapital = capital * (targetRisk / 100);
    // const dealCapital = capital * (capInDealPercent / 100);

    const leverage = roundNumber(Math.max(1, (riskCapital/(stopLossPercent/100))/capital/(capInDealPercent/100)));
    const marginInDeal = roundNumber(riskCapital / (stopLossPercent / 100) / leverage);
    const volume = roundNumber(marginInDeal * leverage);
    // const dealRisk = roundNumber(volume * (stopLossPercent / 100));

    const minVolume = minAssetQty * price;
    const volumeStep = assetQtyStep * price;
    const roundedCount = Math.max(0, Math.ceil((volume - minVolume) / volumeStep));
    const finalVolume = roundNumber(minVolume + volumeStep * roundedCount);
    const finalLeverage = roundNumber(Math.max(1, finalVolume / marginInDeal));
    const finalMargin = roundNumber(finalVolume / finalLeverage);
    const finalAssetVolume = (minVolume + volumeStep * roundedCount) / price;

    // console.log("minAssetQty", minAssetQty);
    // console.log("assetQtyStep", assetQtyStep);
    // console.log("price", price);

    return{
        leverage,
        volume,
        marginInDeal,

        finalLeverage,
        finalVolume,
        finalAssetVolume,
        finalMargin
    }
}