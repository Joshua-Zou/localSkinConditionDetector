module.exports = async function everything(path){

  const fs = require("fs");
  var everyresult;
  
  var __assign = (this && this.__assign) || function () {
      __assign = Object.assign || function(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                  t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };
  var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
      function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  };
  var __generator = (this && this.__generator) || function (thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
      function verb(n) { return function (v) { return step([n, v]); }; }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (_) try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [op[0] & 2, t.value];
              switch (op[0]) {
                  case 0: case 1: t = op; break;
                  case 4: _.label++; return { value: op[1], done: false };
                  case 5: _.label++; y = op[1]; op = [0]; continue;
                  case 7: op = _.ops.pop(); _.trys.pop(); continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                      if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                      if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                      if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                      if (t[2]) _.ops.pop();
                      _.trys.pop(); continue;
              }
              op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
      }
  };
  var __spreadArrays = (this && this.__spreadArrays) || function () {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
      for (var r = Array(s), k = 0, i = 0; i < il; i++)
          for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
              r[k] = a[j];
      return r;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  /*
   -------------------------------------------------------------
  START OF ACTUAL THING
   -------------------------------------------------------------
   */
  var tf = require("@tensorflow/tfjs-node");
  var fs_1 = require("fs");
  var ImageModel = /** @class */ (function () {
      function ImageModel(signaturePath) {
          var _a;
          this.outputKey = "Confidences";
          //var signatureData = fs_1.readFileSync(signaturePath, "utf8");
          this.signature = signaturePath
          this.modelPath = this.signature.filename;
          _a = this.signature.inputs.Image.shape.slice(1, 3), this.width = _a[0], this.height = _a[1];
          this.outputName = this.signature.outputs[this.outputKey].name;
          this.classes = this.signature.classes.Label;
      }
      ImageModel.prototype.load = function () {
          return __awaiter(this, void 0, void 0, function () {
              var _a;
              return __generator(this, function (_b) {
                  switch (_b.label) {
                      case 0:
                          _a = this;
                          return [4 /*yield*/, tf.loadGraphModel(this.modelPath)];
                      case 1:
                          _a.model = _b.sent();
                          return [2 /*return*/];
                  }
              });
          });
      };
      ImageModel.prototype.dispose = function () {
          if (this.model) {
              this.model.dispose();
          }
      };
      ImageModel.prototype.predict = function (image) {
          var _a, _b;
          /*
          Given an input image decoded by tensorflow as a tensor,
          preprocess the image into pixel values of [0,1], center crop to a square
          and resize to the image input size, then run the prediction!
           */
          if (!!this.model) {
              var _c = image.shape.slice(0, 2), imgHeight = _c[0], imgWidth = _c[1];
              // convert image to 0-1
              var normalizedImage = tf.div(image, tf.scalar(255));
              // make into a batch of 1 so it is shaped [1, height, width, 3]
              var reshapedImage = normalizedImage.reshape(__spreadArrays([1], normalizedImage.shape));
              // center crop and resize
              var top = 0;
              var left = 0;
              var bottom = 1;
              var right = 1;
              if (imgHeight != imgWidth) {
                  // the crops are normalized 0-1 percentage of the image dimension
                  var size = Math.min(imgHeight, imgWidth);
                  left = (imgWidth - size) / 2 / imgWidth;
                  top = (imgHeight - size) / 2 / imgHeight;
                  right = (imgWidth + size) / 2 / imgWidth;
                  bottom = (imgHeight + size) / 2 / imgHeight;
              }
              var croppedImage = tf.image.cropAndResize(reshapedImage, [[top, left, bottom, right]], [0], [this.height, this.width]);
              var results = this.model.execute((_a = {}, _a[this.signature.inputs.Image.name] = croppedImage, _a), this.outputName);
              var resultsArray_1 = results.dataSync();
              return _b = {},
                  _b[this.outputKey] = this.classes.reduce(function (acc, class_, idx) {
                      var _a;
                      return __assign((_a = {}, _a[class_] = resultsArray_1[idx], _a), acc);
                  }, {}),
                  _b;
          }
          else {
              console.error("Model not loaded, please await this.load() first.");
          }
      };
      return ImageModel;
  }());
  function main(imgPath) {
      return __awaiter(this, void 0, void 0, function () {
          var image, decodedImage, model, results;
          return __generator(this, function (_a) {
              switch (_a.label) {
                  case 0: return [4 /*yield*/, fs_1.promises.readFile(imgPath)];
                  case 1:
                      image = _a.sent();
                      decodedImage = tf.node.decodeImage(image, 3);
                      //model = new ImageModel(__dirname.slice(0, (__dirname.length-8))+"/signature.json");
                      model = new ImageModel({"doc_id": "a381ef82-d100-4f40-97aa-cb96dba9b4cb", "doc_name": "Skin Detector", "doc_version": "ce7f0dda7a79fc3a7b953c5ea19ecf04", "format": "tf_js", "version": 10, "inputs": {"Image": {"dtype": "float32", "shape": [null, 224, 224, 3], "name": "Image:0"}}, "outputs": {"Confidences": {"dtype": "float32", "shape": [null, 17], "name": "f2dfc9a4-5fed-46d8-a134-dd27efdeef98/dense_2/Softmax:0"}}, "tags": null, "classes": {"Label": ["Acne", "Actinic Keratosis", "Basal Skin Cancer", "Blister", "Cellulitis", "Chickenpox", "Cold_sore", "Keratosis-pilaris", "lupus", "measles", "melanoma", "melesma", "normal", "psoriasis", "ringworm", "rosacea", "vitiligo"]}, "filename":"file://"+ __dirname.slice(0, (__dirname.length-8))+"/model.json"})
                      return [4 /*yield*/, model.load()];
                  case 2:
                      _a.sent();
                      results = model.predict(decodedImage);
                      //let arrResult = Object.values(results);
                      const getMax = object => {
                        return Object.keys(object).filter(x => {
                        return object[x] == Math.max.apply(null, 
                        Object.values(object));
                        });
                      };
                     let largest = getMax(results.Confidences)
                     if (largest[0].toLowerCase().includes("actinic")){
                      model.dispose();
                      everyresult = {status: "ok", type: "actinic-keratosis", confidence: results.Confidences[largest[0]]}
                    }else if (largest[0].toLowerCase().includes("acne")){
                      model.dispose();
                      everyresult = {status: "ok", type: "acne", confidence: results.Confidences[largest[0]]};
                    }else if (largest[0].toLowerCase().includes("basal")){
                      model.dispose();
                      everyresult = {status: "ok", type: "basal-cell-cancer", confidence: results.Confidences[largest[0]]};
                    }else if (largest[0].toLowerCase().includes("blister")){
                      model.dispose();
                      everyresult ={status: "ok", type: "blister", confidence: results.Confidences[largest[0]]};
                    }else if (largest[0].toLowerCase().includes("cellulitis")){
                      model.dispose();
                      everyresult ={status: "ok", type: "cellulitis", confidence: results.Confidences[largest[0]]};
                    }else if (largest[0].toLowerCase().includes("chicken")){
                      model.dispose();
                      everyresult ={status: "ok", type: "chickenpox", confidence: results.Confidences[largest[0]]};
                    }else if (largest[0].toLowerCase().includes("cold")){
                      model.dispose();
                      everyresult ={status: "ok", type: "cold-sore", confidence: results.Confidences[largest[0]]};
                    }else if (largest[0].toLowerCase().includes("keratosis")){
                      model.dispose();
                      everyresult ={status: "ok", type: "keratosis-pilaris", confidence: results.Confidences[largest[0]]};
                    }else if (largest[0].toLowerCase().includes("lupus")){
                      model.dispose();
                      everyresult ={status: "ok", type: "lupus", confidence: results.Confidences[largest[0]]};
                    }else if (largest[0].toLowerCase().includes("measle")){
                      model.dispose();
                      everyresult ={status: "ok", type: "measles", confidence: results.Confidences[largest[0]]};
                    }else if (largest[0].toLowerCase().includes("ringworm")){
                      model.dispose();
                      everyresult ={status: "ok", type: "ringworm", confidence: results.Confidences[largest[0]]};
                    }else if (largest[0].toLowerCase().includes("melanoma")){
                      model.dispose();
                      everyresult ={status: "ok", type: "melanoma", confidence: results.Confidences[largest[0]]};
                    }else if (largest[0].toLowerCase().includes("melesma")){
                      model.dispose();
                      everyresult ={status: "ok", type: "melasma", confidence: results.Confidences[largest[0]]};
                    }else if (largest[0].toLowerCase().includes("psoriasis")){
                      model.dispose();
                      everyresult ={status: "ok", type: "psoriasis", confidence: results.Confidences[largest[0]]};
                    }else if (largest[0].toLowerCase().includes("rosacea")){
                      model.dispose();
                      everyresult ={status: "ok", type: "rosacea", confidence: results.Confidences[largest[0]]};
                    }else if (largest[0].toLowerCase().includes("vitiligo")){
                      model.dispose();
                      everyresult ={status: "ok", type: "vitiligo", confidence: results.Confidences[largest[0]]};
                    }else if (largest[0].toLowerCase().includes("normal")){
                      model.dispose();
                      everyresult ={status: "ok", type: "no-conditions", confidence: results.Confidences[largest[0]]};
                    }else{
                      model.dispose();
                      everyresult ={status: "ok", type: "no-conditions", confidence: results.Confidences[largest[0]]};
                    }
                    return [2 /*return*/];
              }
          });
      });
  }
  await main(path);
  return everyresult
  }
  
  
  
  
  
  
  
  
  
  
  
  