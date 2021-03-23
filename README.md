# Skin Disease Detector

  

  

This package is an all local version of the package: https://www.npmjs.com/package/@joshyzou/skinconditiondetector
Supports png and jpg file formats.
Chooses between 16 skin conditions (listed below), or `no-conditions`

  
## Usage

```
const skinAi = require("@joshyzou/localskinconditiondetector")

skinAi("./path/to/image.png")
    .then(result => console.log(result));

  

//will return an object like this: 
{ status: 'ok', type: 'lupus' confidence: 1}


```
## Conditions and Accuracy
|Condition|Accuracy  |-|Condition|Accuracy|
|--|--|--|--|--|
| Acne | 95% ||Psoriasis|75%|
|Actinic Keratosis |95%||Ringworm|83%|
|Basal Skin Carcinoma|93%||Rosacea|89%|
|Blisters|70%||Vitiligo|87%|
|Cellulitis|95%|
|Chicken Pox|93%|
|Cold Sore|74%|
|Keratosis Pilaris|91%
|Lupus|81%|
|Measles|81%|
|Melanoma|95%|
|Melasma|79%|

  