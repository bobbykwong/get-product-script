const jsonfile = require('jsonfile')
const newMasterList = './newMasterlist.json'
const merchantList = './merchant-hair.json'
const newMerchantList = './master-hair.json'
const axios = require('axios');

/*
// Merchant API
merchant_base_url = "https://gaigai.com"
merchant_consumer_key = "ck_20d4c499f10909d53015ce28f0ab657b60e8488c"
merchant_consumer_secret = "cs_487070c9bad8d1f1f2856c4aeddbc663bb53fe61"

merchant_api = API(
    url=merchant_base_url,
    consumer_key=merchant_consumer_key,
    consumer_secret=merchant_consumer_secret,
    version="wc/v3",
    timeout=20
)


let productNames = [];
const file = './newMasterList.json'
const getAllProducts = () => {
    let nextPage = true;
    let lastPage = true;
    let pageNum = 1
    
    const callEndpoint = (pageNumber) => {
        axios.get("https://gaigai.com/wp-json/wc/v3/products", {
            params: {
                page: pageNumber,
                per_page: "100",
                consumer_key: "ck_20d4c499f10909d53015ce28f0ab657b60e8488c",
                consumer_secret: "cs_487070c9bad8d1f1f2856c4aeddbc663bb53fe61"
                }    
        })
            .then(response => {
                nextPage = response["headers"]["link"].includes("next");
                lastPage = response["headers"]["link"].includes("last");
    
                const productArray = response["data"];
                console.log(productArray.length)
                
                productArray.forEach(e => {
                    productNames.push(e["name"])
                });

                const obj = {pageNumber: productNames}

                jsonfile.writeFile(file, obj)
                    .then(res => {
                        console.log('page complete')
                        if(nextPage || lastPage){
                            callEndpoint(pageNumber+1)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
                
            })
            .catch(err => {
                console.log(err)
                return;
            })
    }

    callEndpoint(pageNum);

}

getAllProducts();
*/

jsonfile.readFile(newMasterList)
.then( obj => {
    let masterListArray = [];

    const allProductsMaster = obj["pageNumber"];
    
    let productNamesArrayMaster = [];
    // Split all product Names 
    allProductsMaster.forEach(element => {
        productNamesArrayMaster.push(element.split(" "));
    });

    // console.log(productNamesArrayMaster);

    let merchantProductList = []
    jsonfile.readFile(merchantList)
    .then(merchantObj => {
        const merchantkeys = Object.keys(merchantObj);
        merchantkeys.forEach(key => {
            merchantObj[key]["id"] = key
            merchantProductList.push(merchantObj[key])
        });
    
        let productNamesArrayMerchant = [];
        merchantProductList.forEach(element => {
            const id = element["id"] 
            const price = element["Selling Price"].toString()
            
            let name = element["Name"].split(" ")
            name.push(price);
            name.push(id);
            productNamesArrayMerchant.push(name)
        });
        console.log(productNamesArrayMerchant)

        let results = []
        // Do matching
        for (let indexMer = 0; indexMer < productNamesArrayMerchant.length; indexMer++) {
            let optionsArray = [];
            const merchantProductFirstWord = productNamesArrayMerchant[indexMer][0].toUpperCase();
            
            for (let indexMas = 0; indexMas < productNamesArrayMaster.length; indexMas++) {
                const masterProductFirstWord = productNamesArrayMaster[indexMas][0].toUpperCase();
                
                // Check first word which is typically brand name
                if(merchantProductFirstWord == masterProductFirstWord){
                    let points = 0
                    // Check if any other words match
                    for (let indexProduct = 0; indexProduct < productNamesArrayMaster[indexMas].length; indexProduct++) {
                        const currentWord = productNamesArrayMaster[indexMas][indexProduct];
                        if(productNamesArrayMerchant[indexMer].includes(currentWord.toUpperCase())){
                            points++;
                        }
                    }
                    if(points === productNamesArrayMerchant[indexMer].length){
                        results.push(productNamesArrayMerchant[indexMer][productNamesArrayMerchant[indexMer].length - 1])
                        break;
                    }
                    else if(points >= 2 ){
                        optionsArray.push(productNamesArrayMaster[indexMas].join(" "))
                    }
                }
                else if(optionsArray.length === 0 && indexMas === productNamesArrayMaster.length - 1){
                    results.push(false);
                }
            }
            
            if(optionsArray.length > 0){
                optionsArray.push(productNamesArrayMerchant[indexMer][productNamesArrayMerchant[indexMer].length - 1])
                optionsArray.push(productNamesArrayMerchant[indexMer][productNamesArrayMerchant[indexMer].length - 2])
                results.push(optionsArray)
            }
        }
        const data = {"results": results}
        jsonfile.writeFile(newMerchantList, data)
            .then(res => {
                console.log("done")
            })
            .catch(err => {
                console.log(err)
            })
    })
})