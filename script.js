const jsonfile = require('jsonfile')
const masterList = './masterlist.json'
const merchantList = './merchant-list-household.json'
const axios = require('axios');

// Merchant API
merchant_base_url = "https://gaigai.com"
merchant_consumer_key = "ck_20d4c499f10909d53015ce28f0ab657b60e8488c"
merchant_consumer_secret = "cs_487070c9bad8d1f1f2856c4aeddbc663bb53fe61"
/*
merchant_api = API(
    url=merchant_base_url,
    consumer_key=merchant_consumer_key,
    consumer_secret=merchant_consumer_secret,
    version="wc/v3",
    timeout=20
)
*/

const getAllProducts = () => {
    
    axios.get(`https://gaigai.com/wp-json/wc/v3/products?consumer_key=${merchant_consumer_key}&consumer_secret=${merchant_consumer_secret}&per_page=100`, {
    
    })
        .then(response => {
            console.log(response["headers"]["link"]);
            const productArray = response["data"];
            productNames = [];
            productArray.forEach(e => {
                productNames.push(e["name"])
            });
            // console.log(productNames);
        })
        .catch(err => {
            console.log(err)
        })

}

getAllProducts();
/*
jsonfile.readFile(masterList)
.then( obj => {
    let masterListArray = [];
    // Put all product objects into an array
    const keys = Object.keys(obj);
    keys.forEach(key => {
        masterListArray.push(obj[key])
    });
  
    let masterProductArray = [];
    masterListArray.forEach(element => {
        const name = element["Name"].split(" ")
        masterProductArray.push(name)
    });
    
    let merchantProductList = []
    jsonfile.readFile(merchantList)
    .then(merchantObj => {
        const merchantkeys = Object.keys(obj);
        merchantkeys.forEach(key => {
            merchantProductList.push(obj[key])
        });
    
        let merchantProductArray = [];
        merchantProductList.forEach(element => {
            const name = element["Name"].split(" ")
            merchantProductArray.push(name)
        });


        // Do matching
        // Check first word which is typically brand name
        for (let indexMer = 0; indexMer < merchantProductArray.length; indexMer++) {
            const merchantProductFirstWord = merchantProductArray[indexMer][0].toLowerCase();
            
            for (let indexMas = 0; indexMas < masterProductArray.length; indexMas++) {
                const masterProductFirstWord = masterProductArray[indexMas][0].toLowerCase();
                
                if(merchantProductFirstWord == masterProductFirstWord){
                    console.log(merchantProductFirstWord);
                }
            }
        }
    })
})

*/