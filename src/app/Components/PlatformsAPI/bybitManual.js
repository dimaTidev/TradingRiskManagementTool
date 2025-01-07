const crypto = require("crypto");
// // const fetch = require("node-fetch");

const apiKey = process.env.NEXT_PUBLIC_API_KEY;
const apiSecret = process.env.NEXT_PUBLIC_API_SECRET;

// const fetchUSDCBalance = async () => {
//   const url = "https://api.bybit.com/v5/account/wallet-balance";
//   const params = {
//     accountType: "CONTRACT" // Adjust based on your account type (e.g., CONTRACT, SPOT)
//   };
//   const timestamp = Date.now();
//   const queryString = new URLSearchParams({ ...params, api_key: apiKey, timestamp }).toString();

//   // Create signature
//   const signature = crypto
//     .createHmac("sha256", apiSecret)
//     .update(queryString)
//     .digest("hex");

//   const finalUrl = `${url}?${queryString}&sign=${signature}&coin=USDC`;

//   try {
//     const response = await fetch(finalUrl, {
// 		method: 'GET',
// 		headers: {
// 			'X-RapidAPI-Key': 'your-rapidapi-key',
// 			'X-RapidAPI-Host': 'famous-quotes4.p.rapidapi.com',
// 		}
//     });
//     const data = await response.json();
//     console.log("data:", data);
//     // const usdcBalance = data.result.balances.find(balance => balance.coin === "USDC");
//     // console.log("USDC Balance:", usdcBalance.available_balance);
//   } catch (error) {
//     console.error("Error fetching balance:", error);
//   }
// };

// fetchUSDCBalance();

// -------------------------

// const fetchUSDCBalance = async () => {
//     const url = "https://api.bybit.com/v5/account/wallet-balance";

//     const timestamp = Date.now();

//     // Create signature
//     const signature = crypto
//     .createHmac("sha256", apiSecret);
//     // .update(queryString)
//     // .digest("hex");

//     try {
//         const response = await fetch(url, {
//             method: 'GET',
//             headers: {
//                 'X-BAPI-API-KEY': apiKey,
//                 'X-BAPI-TIMESTAMP': timestamp,
//                 'X-BAPI-RECV-WINDOW': '2000',
//                 'X-BAPI-SIGN': signature
//             }
//         });
//         const data = await response.json();
//         console.log("data:", data);
//     } catch (error) {
//         console.error("Error fetching balance:", error);
//     }
// }

// fetchUSDCBalance();

// -----------------------------



const fetchUSDCBalance = async () => {
    // const url = "https://api.bybit.com/v5/account/wallet-balance";
    const url = "https://api-demo.bybit.com/v5/account/wallet-balance";

    const timestamp = Date.now();
    const params = {
        accountType: "UNIFIED" // Use UNIFIED for unified accounts
    };

    // Create query string
    const queryString = new URLSearchParams(params).toString();

    // Create signature
    const preSignString = `${timestamp}${apiKey}2000${queryString}`;
    const signature = crypto
        .createHmac("sha256", apiSecret)
        .update(preSignString)
        .digest("hex");

    try {
        const response = await fetch(`${url}?${queryString}`, {
            method: "GET",
            headers: {
                "X-BAPI-API-KEY": apiKey,
                "X-BAPI-TIMESTAMP": timestamp,
                "X-BAPI-RECV-WINDOW": "2000",
                "X-BAPI-SIGN": signature
            }
        });
        const data = await response.json();
        console.log("data:", data);
        console.log("result:", data.result);
        console.log("coin:", data.result.list[0].coin);
    } catch (error) {
        console.error("Error fetching balance:", error);
    }
};

fetchUSDCBalance();