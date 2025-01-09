const { RestClientV5 } = require('bybit-api');

const apiKey = process.env.NEXT_PUBLIC_API_KEY;
const apiSecret = process.env.NEXT_PUBLIC_API_SECRET;

let client;

export async function createClient(apiKey, apiSecret){
    client = new RestClientV5({
        testnet: true,
        key: apiKey,
        secret: apiSecret,
        parseAPIRateLimits: true,
        demoTrading: true
    });
}

export function deleteClient(){
    client = undefined;
}

// async function getWalletBalance(){
//     const responce = await client.getWalletBalance({
//         accountType: 'UNIFIED',
//         coin: 'USDT',
//     })
//     // .then((response) => {
//     //     console.log(response);
//     // })
//     .catch((error) => {
//         console.error(error);
//     });

//     console.log("responce", responce);
//     console.log("responce.result", responce.result);
//     console.log("responce.result.list[0].coin", responce.result.list[0].coin);
// }

export async function submitOrder(symbol, side, orderType, qty, leverage, price, takeProfit, stopLoss){
    symbol = symbol?.toString();
    side = side?.toString();
    orderType = orderType?.toString();
    qty = qty?.toString();
    leverage = leverage?.toString();
    price = price?.toString();
    takeProfit = takeProfit?.toString();
    stopLoss = stopLoss?.toString();

    // console.log("symbol", symbol);
    // console.log("side", side);
    // console.log("orderType", orderType);
    // console.log("qty", qty);
    // console.log("leverage", leverage);
    // console.log("price", price);
    // console.log("takeProfit", takeProfit);
    // console.log("stopLoss", stopLoss);

    // https://bybit-exchange.github.io/docs/v5/position/leverage
    // Make sure everythin has string type!!!
    await client
    .setLeverage({
        category: 'linear',
        symbol: symbol,
        buyLeverage: leverage,
        sellLeverage: leverage,
    })
    .then((response) => {
        console.log(JSON.stringify(response));
    })
    .catch((error) => {
        console.error(error);
    });

    //https://bybit-exchange.github.io/docs/v5/order/create-order
    const responce = await client.submitOrder({
        category: 'linear',
        symbol: symbol,
        // isLeverage: "1", // 0, 1 // how to set the leverage?
        side: side == "Long" ? "Buy" : "Sell",
        orderType: orderType, //Market, Limit
        qty: qty, // = volume
        // marketUnit: "USDT",
        price: price,
        // takeProfit: '98000',
        // stopLoss: '90000',
        takeProfit: takeProfit,
        stopLoss: stopLoss,
    });
    
    console.log('responce:', JSON.stringify(responce));
}

// async function getTickers(){
//     // https://bybit-exchange.github.io/docs/v5/market/tickers
//     client
//     .getTickers({
//         category: 'inverse',
//         symbol: 'BTCUSDT'
//     })
//     .then((response) => {
//         console.log(response);
//         console.log(response.result.list);
//     })
//     .catch((error) => {
//         console.error(error);
//     });
// }

// async function getInstrumentsInfo(){
//     // https://bybit-exchange.github.io/docs/v5/market/instrument
//     client
//     .getInstrumentsInfo({
//         category: 'linear',
//         symbol: 'BTCUSDT',
//     })
//     .then((response) => {
//         console.log(response);
//         console.log(response.result);

//         const lotSizeFilter = response.result.list[0].lotSizeFilter;
//         const leverageFilter = response.result.list[0].leverageFilter;
//     })
//     .catch((error) => {
//         console.error(error);
//     });
// }

export async function getTickerPricing(symbol){
    if(symbol == undefined){
        return {
            markPrice: 0,
            errorMsg: undefined
        }
    }

    try {
        const response = await client.getTickers({
            category: 'inverse',
            symbol: symbol
        })

        if(response.retCode != 0){
            console.log(response.retMsg);
        }
    
        return {
            markPrice: response?.result?.list[0]?.markPrice,
            errorMsg: response.retCode != 0 ? response.retMsg : undefined
        }
    } catch (error) {
        console.error("caught", error);
    }
}

export async function getTickerInfo(symbol){
    if(symbol == undefined){
        return {
            markPrice: 0,
            errorMsg: undefined
        }
    }
    
    try {
        const response = await client.getInstrumentsInfo({
            category: 'linear',
            symbol: symbol,
        });

        if(response.retCode != 0){
            console.log(response.retMsg);
        }

        const lotSizeFilter = response?.result?.list[0]?.lotSizeFilter;
        const leverageFilter = response?.result?.list[0]?.leverageFilter;

        // console.log("response.result.list[0]", response.result.list[0]);
        // console.log("lotSizeFilter", lotSizeFilter);
        // console.log("leverageFilter", leverageFilter);

        return {
            baseCoin: response?.result?.list[0]?.baseCoin,
            quoteCoin: response?.result?.list[0]?.quoteCoin,
            minOrderQty: lotSizeFilter?.minOrderQty,
            qtyStep: lotSizeFilter?.qtyStep,
            minLeverage: leverageFilter?.minLeverage,
            maxLeverage: leverageFilter?.maxLeverage,
            errorMsg: response.retCode != 0 ? response.retMsg : undefined
        }
    } catch (error) {
        console.error("caught", error);
    }


    /*
    {
        "minOrderQty": "0.001",
        "qtyStep": "0.001",
        "minLeverage": "1",
        "maxLeverage": "100.00",
        "errorMsg": "params error: symbol invalid",
    }
    */
}


// async function Program(){
//     const result = await getTickerInfo('BTCUSDT');
//     console.log("Program result", result);
    
// }

// getInstrumentsInfo();
// getTickers();
// Program();

// submitOrder();


// getWalletBalance();