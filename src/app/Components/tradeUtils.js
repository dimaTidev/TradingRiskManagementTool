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

/**
 * @typedef {Object} RiskOrder
 * @property {number} leverage - The leverage multiplier used.
 * @property {number} volume - The corrected trading volume based on constraints.
 * @property {number} incorrectVolume - The initially calculated (but potentially incorrect) trading volume.
 * @property {number} marginInDeal - The corrected margin required for the deal.
 * @property {number} assetVolume - The volume of the asset to trade.
 * @property {number} stopLossPriceLong - The stop-loss price for a long position.
 * @property {number} stopLossPriceShort - The stop-loss price for a short position.
 * @property {number} takeProfitPriceLong - The take-profit price for a long position.
 * @property {number} takeProfitPriceShort - The take-profit price for a short position.
 * @property {number} price - The current price of the asset.
 * @property {number} riskPercent - The risk percentage of the trade based on capital.
 * @property {number} risk - The absolute risk amount in capital terms.
 */

// TODO: complete!
/**
 * Calculates parameters for a risk-managed trading order.
 * @param {number} capital - Total capital available for trading.
 * @param {number} targetRisk - Target risk percentage per trade.
 * @param {number} leverage - Leverage multiplier for the trade.
 * @param {number} stopLossPercent - Percentage of price for stop loss.
 * @param {number} price - Current price of the asset.
 * @param {number} minAssetQty - Minimum quantity of the asset to trade.
 * @param {number} assetQtyStep - Step size for trading quantity adjustments.
 * @returns {RiskOrder} An object containing calculated trading parameters.
 */
export function calculateRiskOrderSimple(capital, targetRisk, leverage, stopLossPercent, price, minAssetQty, assetQtyStep, takeProfitRR){
    capital = Number.parseFloat(capital);
    targetRisk = Number.parseFloat(targetRisk);
    leverage = Number.parseFloat(leverage);
    price = Number.parseFloat(price);
    minAssetQty = Number.parseFloat(minAssetQty);
    assetQtyStep = Number.parseFloat(assetQtyStep);
    takeProfitRR = Number.parseFloat(takeProfitRR);


    const riskCapital = capital * (targetRisk / 100);

    const marginInDeal = roundNumber(riskCapital / (stopLossPercent / 100) / leverage);
    const volume = roundNumber(marginInDeal * leverage);

    const stopLossPriceLong = price - price * (stopLossPercent / 100);
    const stopLossPriceShort = price + price * (stopLossPercent / 100);

    const takeProfitPriceLong = price + price * (stopLossPercent / 100) * takeProfitRR;
    const takeProfitPriceShort = price - price * (stopLossPercent / 100) * takeProfitRR;

    /// assetQtyStep
    
    // TODO: take into account the minAssetQty and assetQtyStep
    // const assetVolume = Math.max(minAssetQty, Math.floor((volume / price - minAssetQty)));// * assetQtyStep + minAssetQty;
    const assetVolume = roundNumber(Math.floor(((volume / price - minAssetQty) / assetQtyStep)) * assetQtyStep + minAssetQty, countDecimalPlaces(assetQtyStep));

    const actualVolume = assetVolume * price;
    const actualMargin = actualVolume / leverage;

    return{
        leverage,
        volume: actualVolume,
        incorrectVolume: volume,
        marginInDeal: actualMargin,
        assetVolume,
        stopLossPriceLong,
        stopLossPriceShort,
        takeProfitPriceLong,
        takeProfitPriceShort,
        price,
        riskPercent: actualVolume * (stopLossPercent / 100) / capital * 100,
        risk: actualVolume * (stopLossPercent / 100)
    }
}

/**
 * @param {Number} price 
 * @param {Number} stopLossPercent 
 * @param {Number} takeProfitRR 
 * @param {"Long"|"Short"} orderDirection 
 * @returns 
 */
export function calculateTakeProfitPrice(price, stopLossPercent, takeProfitRR, orderDirection){
    const slDelta = price * stopLossPercent;
    const tpDelta = slDelta * takeProfitRR;
    return orderDirection == "Long" ? price + tpDelta : price - tpDelta;
}

/**
 * @param {Number} price 
 * @param {Number} stopLossPercent 
 * @param {"Long"|"Short"} orderDirection 
 * @returns 
 */
export function calculateStopLossPrice(price, stopLossPercent, orderDirection){
    const slDelta = price * stopLossPercent;

    return orderDirection == "Long" ? price - slDelta : price + slDelta;
}


export function countDecimalPlaces(num) {
    if (num == undefined || Math.floor(num) === num) return 0;
    const split = num.toString().split('.');
    if(split.length <= 1) return 0;
    return num.toString().split('.')[1].length || 0;
}