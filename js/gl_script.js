// --------------------------------------------------------START----------------------------------------------------------//
// --------------------------------------------------------do not edit or remove----------------------------------------------------------//
Vector3 = function (x,y,z) {
   this.x = x || 0;
   this.y = y || 0;
   this.z = z || 0;
};
Vector3.prototype = {
   constructor: Vector3,
   set: function (x,y,z) {
      this.x = x;
      this.y = y;
      this.z = z;
      return this;
   },
   setX: function (x) {
      this.x = x;
      return this;
   },
   setY: function (y) {
      this.y = y;
      return this;
   },
   setZ: function (z) {
      this.z = z;
      return this;
   },
   setComponent: function (index,value) {
      switch (index) {
         case 0:
            this.x = value;
            break;
         case 1:
            this.y = value;
            break;
         case 2:
            this.z = value;
            break;
         default:
            throw new Error('index is out of range: ' + index);
      }
   },
   getComponent: function (index) {
      switch (index) {
         case 0:
            return this.x;
         case 1:
            return this.y;
         case 2:
            return this.z;
         default:
            throw new Error('index is out of range: ' + index);
      }
   },
   copy: function (v) {
      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
      return this;
   },
   add: function (v,w) {
      if (w !== undefined) {
         console.warn('Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.');
         return this.addVectors(v,w);
      }
      this.x += v.x;
      this.y += v.y;
      this.z += v.z;
      return this;
   },
   addScalar: function (s) {
      this.x += s;
      this.y += s;
      this.z += s;
      return this;
   },
   addVectors: function (a,b) {
      this.x = a.x + b.x;
      this.y = a.y + b.y;
      this.z = a.z + b.z;
      return this;
   },
   sub: function (v,w) {
      if (w !== undefined) {
         console.warn('Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.');
         return this.subVectors(v,w);
      }
      this.x -= v.x;
      this.y -= v.y;
      this.z -= v.z;
      return this;
   },
   subVectors: function (a,b) {
      this.x = a.x - b.x;
      this.y = a.y - b.y;
      this.z = a.z - b.z;
      return this;
   },
   multiply: function (v,w) {
      if (w !== undefined) {
         console.warn('Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.');
         return this.multiplyVectors(v,w);
      }
      this.x *= v.x;
      this.y *= v.y;
      this.z *= v.z;
      return this;
   },
   multiplyScalar: function (scalar) {
      this.x *= scalar;
      this.y *= scalar;
      this.z *= scalar;
      return this;
   },
   multiplyVectors: function (a,b) {
      this.x = a.x * b.x;
      this.y = a.y * b.y;
      this.z = a.z * b.z;
      return this;
   },
   applyEuler: function () {
      var quaternion;
      return function (euler) {
         if (euler instanceof Euler === false) {
            console.error('Vector3: .applyEuler() now expects a Euler rotation rather than a Vector3 and order.');
         }
         if (quaternion === undefined) quaternion = new Quaternion();
         this.applyQuaternion(quaternion.setFromEuler(euler));
         return this;
      };
   }(),
   applyAxisAngle: function () {
      var quaternion;
      return function (axis,angle) {
         if (quaternion === undefined) quaternion = new Quaternion();
         this.applyQuaternion(quaternion.setFromAxisAngle(axis,angle));
         return this;
      };
   }(),
   applyMatrix3: function (m) {
      var x = this.x;
      var y = this.y;
      var z = this.z;
      var e = m.elements;
      this.x = e[0] * x + e[3] * y + e[6] * z;
      this.y = e[1] * x + e[4] * y + e[7] * z;
      this.z = e[2] * x + e[5] * y + e[8] * z;
      return this;
   },
   applyMatrix4: function (m) {
      // input: Matrix4 affine matrix
      var x = this.x,
         y = this.y,
         z = this.z;
      var e = m.elements;
      this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
      this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
      this.z = e[2] * x + e[6] * y + e[10] * z + e[14];
      return this;
   },
   applyProjection: function (m) {
      // input: Matrix4 projection matrix
      var x = this.x,
         y = this.y,
         z = this.z;
      var e = m.elements;
      var d = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]); // perspective divide
      this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * d;
      this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * d;
      this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * d;
      return this;
   },
   applyQuaternion: function (q) {
      var x = this.x;
      var y = this.y;
      var z = this.z;
      var qx = q.x;
      var qy = q.y;
      var qz = q.z;
      var qw = q.w;
      // calculate quat * vector
      var ix = qw * x + qy * z - qz * y;
      var iy = qw * y + qz * x - qx * z;
      var iz = qw * z + qx * y - qy * x;
      var iw = -qx * x - qy * y - qz * z;
      // calculate result * inverse quat
      this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
      this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
      this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
      return this;
   },
   transformDirection: function (m) {
      // input: Matrix4 affine matrix
      // vector interpreted as a direction
      var x = this.x,
         y = this.y,
         z = this.z;
      var e = m.elements;
      this.x = e[0] * x + e[4] * y + e[8] * z;
      this.y = e[1] * x + e[5] * y + e[9] * z;
      this.z = e[2] * x + e[6] * y + e[10] * z;
      this.normalize();
      return this;
   },
   divide: function (v) {
      this.x /= v.x;
      this.y /= v.y;
      this.z /= v.z;
      return this;
   },
   divideScalar: function (scalar) {
      if (scalar !== 0) {
         var invScalar = 1 / scalar;
         this.x *= invScalar;
         this.y *= invScalar;
         this.z *= invScalar;
      } else {
         this.x = 0;
         this.y = 0;
         this.z = 0;
      }
      return this;
   },
   min: function (v) {
      if (this.x > v.x) {
         this.x = v.x;
      }
      if (this.y > v.y) {
         this.y = v.y;
      }
      if (this.z > v.z) {
         this.z = v.z;
      }
      return this;
   },
   max: function (v) {
      if (this.x < v.x) {
         this.x = v.x;
      }
      if (this.y < v.y) {
         this.y = v.y;
      }
      if (this.z < v.z) {
         this.z = v.z;
      }
      return this;
   },
   clamp: function (min,max) {
      // This function assumes min < max, if this assumption isn't true it will not operate correctly
      if (this.x < min.x) {
         this.x = min.x;
      } else if (this.x > max.x) {
         this.x = max.x;
      }
      if (this.y < min.y) {
         this.y = min.y;
      } else if (this.y > max.y) {
         this.y = max.y;
      }
      if (this.z < min.z) {
         this.z = min.z;
      } else if (this.z > max.z) {
         this.z = max.z;
      }
      return this;
   },
   clampScalar: (function () {
      var min,max;
      return function (minVal,maxVal) {
         if (min === undefined) {
            min = new Vector3();
            max = new Vector3();
         }
         min.set(minVal,minVal,minVal);
         max.set(maxVal,maxVal,maxVal);
         return this.clamp(min,max);
      };
   })(),
   floor: function () {
      this.x = Math.floor(this.x);
      this.y = Math.floor(this.y);
      this.z = Math.floor(this.z);
      return this;
   },
   ceil: function () {
      this.x = Math.ceil(this.x);
      this.y = Math.ceil(this.y);
      this.z = Math.ceil(this.z);
      return this;
   },
   round: function () {
      this.x = Math.round(this.x);
      this.y = Math.round(this.y);
      this.z = Math.round(this.z);
      return this;
   },
   roundToZero: function () {
      this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
      this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
      this.z = (this.z < 0) ? Math.ceil(this.z) : Math.floor(this.z);
      return this;
   },
   negate: function () {
      this.x = -this.x;
      this.y = -this.y;
      this.z = -this.z;
      return this;
   },
   dot: function (v) {
      return this.x * v.x + this.y * v.y + this.z * v.z;
   },
   lengthSq: function () {
      return this.x * this.x + this.y * this.y + this.z * this.z;
   },
   length: function () {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
   },
   lengthManhattan: function () {
      return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
   },
   normalize: function () {
      return this.divideScalar(this.length());
   },
   setLength: function (l) {
      var oldLength = this.length();
      if (oldLength !== 0 && l !== oldLength) {
         this.multiplyScalar(l / oldLength);
      }
      return this;
   },
   lerp: function (v,alpha) {
      this.x += (v.x - this.x) * alpha;
      this.y += (v.y - this.y) * alpha;
      this.z += (v.z - this.z) * alpha;
      return this;
   },
   cross: function (v,w) {
      if (w !== undefined) {
         console.warn('Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.');
         return this.crossVectors(v,w);
      }
      var x = this.x,
         y = this.y,
         z = this.z;
      this.x = y * v.z - z * v.y;
      this.y = z * v.x - x * v.z;
      this.z = x * v.y - y * v.x;
      return this;
   },
   crossVectors: function (a,b) {
      var ax = a.x,
         ay = a.y,
         az = a.z;
      var bx = b.x,
         by = b.y,
         bz = b.z;
      this.x = ay * bz - az * by;
      this.y = az * bx - ax * bz;
      this.z = ax * by - ay * bx;
      return this;
   },
   projectOnVector: function () {
      var v1,dot;
      return function (vector) {
         if (v1 === undefined) v1 = new Vector3();
         v1.copy(vector).normalize();
         dot = this.dot(v1);
         return this.copy(v1).multiplyScalar(dot);
      };
   }(),
   projectOnPlane: function () {
      var v1;
      return function (planeNormal) {
         if (v1 === undefined) v1 = new Vector3();
         v1.copy(this).projectOnVector(planeNormal);
         return this.sub(v1);
      }
   }(),
   reflect: function () {
      // reflect incident vector off plane orthogonal to normal
      // normal is assumed to have unit length
      var v1;
      return function (normal) {
         if (v1 === undefined) v1 = new Vector3();
         return this.sub(v1.copy(normal).multiplyScalar(2 * this.dot(normal)));
      }
   }(),
   angleTo: function (v) {
      var theta = this.dot(v) / (this.length() * v.length());
      // clamp, to handle numerical problems
      return Math.acos(Math.clamp(theta,-1,1));
   },
   distanceTo: function (v) {
      return Math.sqrt(this.distanceToSquared(v));
   },
   distanceToSquared: function (v) {
      var dx = this.x - v.x;
      var dy = this.y - v.y;
      var dz = this.z - v.z;
      return dx * dx + dy * dy + dz * dz;
   },
   setEulerFromRotationMatrix: function (m,order) {
      console.error('Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead.');
   },
   setEulerFromQuaternion: function (q,order) {
      console.error('Vector3: .setEulerFromQuaternion() has been removed. Use Euler.setFromQuaternion() instead.');
   },
   getPositionFromMatrix: function (m) {
      console.warn('Vector3: .getPositionFromMatrix() has been renamed to .setFromMatrixPosition().');
      return this.setFromMatrixPosition(m);
   },
   getScaleFromMatrix: function (m) {
      console.warn('Vector3: .getScaleFromMatrix() has been renamed to .setFromMatrixScale().');
      return this.setFromMatrixScale(m);
   },
   getColumnFromMatrix: function (index,matrix) {
      console.warn('Vector3: .getColumnFromMatrix() has been renamed to .setFromMatrixColumn().');
      return this.setFromMatrixColumn(index,matrix);
   },
   setFromMatrixPosition: function (m) {
      this.x = m.elements[12];
      this.y = m.elements[13];
      this.z = m.elements[14];
      return this;
   },
   setFromMatrixScale: function (m) {
      var sx = this.set(m.elements[0],m.elements[1],m.elements[2]).length();
      var sy = this.set(m.elements[4],m.elements[5],m.elements[6]).length();
      var sz = this.set(m.elements[8],m.elements[9],m.elements[10]).length();
      this.x = sx;
      this.y = sy;
      this.z = sz;
      return this;
   },
   setFromMatrixColumn: function (index,matrix) {
      var offset = index * 4;
      var me = matrix.elements;
      this.x = me[offset];
      this.y = me[offset + 1];
      this.z = me[offset + 2];
      return this;
   },
   equals: function (v) {
      return ((v.x === this.x) && (v.y === this.y) && (v.z === this.z));
   },
   fromArray: function (array) {
      this.x = array[0];
      this.y = array[1];
      this.z = array[2];
      return this;
   },
   toArray: function () {
      return [this.x,this.y,this.z];
   },
   clone: function () {
      return new Vector3(this.x,this.y,this.z);
   }
};
// --------------------------------------------------------do not edit or remove----------------------------------------------------------//
// --------------------------------------------------------END----------------------------------------------------------//
var first = false;
var second = false;
var third = false;
var fourth = false;
var cat4 = false;
var cat5 = false;
var fourth = false;
var onComplete = true;
var currneAnim;
var vidx1;
var vidx2;
var vidx3;
var preLoadImage1 = new Image();
var preLoadImage2 = new Image();
var preLoadImage3 = new Image();
var preLoadImage4 = new Image();
var preLoadImage5 = new Image();
var preLoadImage6 = new Image();
var preLoadImage7 = new Image();
var preLoadImage8 = new Image();

function load_img() {
   preLoadImage1.src = 'images_gl/loaderblock.jpg';
   preLoadImage2.src = 'images_gl/loader_011.png';
   preLoadImage3.src = 'images_gl/loaderbar.png';
   //        preLoadImage4.src='images_gl/Cloud_Controller/buttons/Cloud_7.svg';
   //        preLoadImage5.src='images_gl/Cloud_Controller/buttons/Cloud_4.svg';
   preLoadImage5.onload = afterLoad;
}

function afterLoad() {
   $('#transPatch').css('display','block');
   $('.fullScreenBox,#close_btn,#logoAdidas,#logoPredator').css('visibility','visible');
}
$(document).ready(function () {
   load_img();
   $(document).on('click','.playAll',autoPlayAllAnimations)
   $(document).on('click','.pauseAll',autoPauseAllAnimations)
});

$(window).load(function () {
   // load_img(); 
});

function closeSuperblaze() {
   scene.stop();
   $(window.parent).unbind('resize');
   window.top.document.getElementById("mainpanel2").contentWindow.stopAutoplay();
   autoplayCatalog = window.top.document.getElementById("mainpanel2").contentWindow.autoplayCatalog;
   $("#superblazeIframe",window.parent.document).css('display','none');
   window.top.document.getElementById("mainpanel2").contentWindow.superblazeClosed();
}
$(function () {
   resizePage(window.innerWidth,window.innerHeight);
   resizePage(window.document.documentElement.clientWidth,window.document.documentElement.clientHeight);
   if ((navigator.userAgent.indexOf('iPad') != -1) || (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0)) {
      // console.log("ie1")
      $("#close").css('display','none');
      $("#fullScreen").css('display','none');
   } else {
      $("#fullScreen").css('display','block');
   }
   //    if ((navigator.userAgent.indexOf('MSIE')!==-1 || navigator.appVersion.indexOf('Trident/') > 0)) {
   //                           console.log("onlyie")
   //                           $(".menuitems, .menuitems1").css("background-color","#4a4a4b");
   //                                       $(".menuitems, .menuitems1").addClass("iespe");
   //
   //                           }
})

function closeOption() {
   for (i = 1; i <= 17; i++) {
      $("#colors" + i).css("display","none");
      $("#forselectcolor" + i).css("display","none");
   }
   $("#colorTextforcat5").css("display","none");
}
$(window).load(function () {
   resizePage(window.document.documentElement.clientWidth,window.document.documentElement.clientHeight);
   $(window).live('resize',function () {
      resizePage(window.innerWidth,window.innerHeight);
   });
   window.onresize = function (event) {
      resizePage(window.innerWidth,window.innerHeight);
   }
});

function onReset() {
   onResetCameraClickGL(); //in _ui.js
}

function onZoomSlide(event,ui) {
   var val = -20 * (ui.value / 100) + 10;
   NavSetDolly(val);
   updateZoomBar(val);
   scene.clearRefine();
}
$(function () {
   // Slider
   //range: 'min',
   $('#zoom_slider').slider({
      orientation: "vertical",
      value: 155,
      min: 0,
      max: 205,
      slide: onZoomSlide
   });
   $('nodrag').on('dragstart',function (event) {
      event.preventDefault();
   });
   $('.nodrag').mousedown(function () {
      return false
   });
});

function buttonsZoom(value) {
   var delta = value;
   var deltaScene = (delta * 0.03) * (0.3);
   deltaScene = -deltaScene;
   if (NavSetDolly(g_navDolly + deltaScene)) {
      scene.clearRefine();
      updateZoomBar(g_navDolly - 10);
   }
}
var updateEnabled = true;
var canvas = null,
   canvas2 = null;
var scene = null,
   scene2 = null;
var _scenePollInterval;
var outstandingJobs;
var totalJobs;
var firstTime = true;
var tempW = 5;
var animationLoading;
var autoplayAnim = false;
$(document).ready(function () {
   animationLoading = setInterval(function () {
      //                                 console.log("loaderbar>>")
      tempW = tempW + 1;
      if (tempW > 30) tempW = 30;
      $("#loaderbar").css("width",tempW + "px");
   },100);
})

function isSuperblazeReady() {
   //    console.log("in")
   if (scene) {
      //totalJobs = 230;
      scene.start();
      outstandingJobs = scene.getOutstandingJobs();
      //         console.log("outstandingJobs", outstandingJobs);
      if (!(scene._projectparsed /*&& scene._started*/)) {
         if (firstTime) {
            firstTime = false;
            //                            animationLoading = setInterval(function() {  
            //                                // console.log("loaderbar>>")
            //                                tempW = tempW + 1;
            //                                if (tempW > 30) tempW = 30;
            //                                $("#loaderbar", window.parent.document).css("width", tempW + "px"); 
            //                               
            //                            }, 10);
         }
      } else if (outstandingJobs <= 0 && scene._prepared) {
         onSuperBlazeReady();
         clearInterval(_scenePollInterval);
      } else if (scene._projectparsed /*&& scene._started*/) {
         clearInterval(animationLoading);
         updateProgressBar();
      }
   }
}

function updateProgressBar() {
   totalJobs = scene.getTotalJobs();
   outstandingJobs = scene.getOutstandingJobs();
   var perc = 100 - Math.round(outstandingJobs / totalJobs * 100);
   // var newwidth = 170-(170 * (outstandingJobs / totalJobs))+20;
   var newwidth = 50 + 141 * perc / 100;
   if (newwidth < 30) newwidth = 30;
   //console.log("updateProgressBar -- loaderbar "+newwidth+"px perc "+perc+" jobs "+outstandingJobs+"/"+totalJobs);
   $("#loaderbar").css("width",newwidth + "px");
}
// $(document).ready(function () { });
var animStoped = true;
var animCntrlBlock = true;
$(window).load(function () {
   var fc = true;
   $(".menuitemsBase").click(function () {
      $("#panel").fadeToggle(200);
      autoPauseAllAnimations();
   });
   $(".menuitems").click(function () {
      //                          if (!animStoped || (!clickEventActive)) return;
      if (!initialLoad) return;
      scene._nav._navMinDolly = 120;
      if (!clickEventActive && !autoRotateState) return;
      var newId = this.id;
      currneAnim = Number(newId.slice(4));
      if (prevAnimation == 11 && currneAnim == 11) {
         console.log("in_if_11")
         for (var j = 1; j <= 10; j++) {
            translateOut(j);
         }
         translateOut(13);
      } else {
         for (var j = 1; j <= 13; j++) {
            translateOut(j);
         }
         menu11Clicked = false;
      }
      prevAnimation = currneAnim;
      //						$( "#accordion" ).accordion( "option", "disabled", true );                        
      autoRotateStop();
      $('#playVideos1').css('display','none');
      $('#playVideos2').css('display','none');
      $('#playVideos3').css('display','none');
      if (videoplay) stopVid();
      clearInterval(autoRotateInterval);
      clearTimeout(autoPlayInt);
      clearTimeout(myVar);
      clearTimeout(startAutorot);
      $("#dummy-canvas").css("pointer-events","all");
      $("#rightAnim").css("display","block");
      scene.instanceSet("Top_Cover_Animation","visible",true);
      scene.animPlayInTime("Top_Cover_Animation",0,1000);
      scene.clearRefine();
      firstAnim = true;
      animblockStopped = false;
      setTimeout(function () {
         animblockStopped = true;
      },2000)
      animStoped = false;
      for (var i = 0; i < timeouts.length; i++) {
         clearTimeout(timeouts[i]);
      }
      timeouts = [];
      $(".menuitems").removeClass('active');
      $(".menuitems").css("background-color","").css("opacity","");
      if (newId == "menu4") {
         $(this).removeClass('active');
         $(this).parents().prev(".menuitems").addClass('active');
      }
      $(this).addClass('active');
      $(".noselect.pointcontent").removeClass("BlockClass");
      var a = "This is where the active feature text is shown -in a space saving place";
      $("#point2text .descriptionDemo").html(a);
      $("#point3text .descriptionDemo").html(a);
      $("#point7text .descriptionDemo").html(a);
      $("#point5text .descriptionDemo").html(a);
      $(".greyOutBox").removeClass("disabled");
      $(".animPlayBtns .greyOutBox, .greyOutBox").removeClass("redOutBox");
      $("#cpSubHeading").text("");
      if (autoplayAnim) autoPauseAllAnimations();
      console.log("currneAnim",currneAnim);
      console.log("id",newId,"currentAnimation",currneAnim);
      //currneAnim = Number(newId.slice(4));  
      objectHide();
      switch (newId) {
         case "menu2":
            $("#accordion").accordion("option","active",false);
            menu2Click();
            break;
         case "menu3":
            menu3Click();
            break;
         case "menu4":
            menu4Click();
            break;
         case "menu5":
            $("#accordion").accordion("option","active",2);
            menu5Click();
            break;
         case "menu6":
            $("#accordion").accordion("option","active",2);
            menu6Click();
            break;
         case "menu7":
            $("#accordion").accordion("option","active",false);
            menu7Click();
            break;
         case "menu8":
            $("#accordion").accordion("option","active",4);
            menu8Click();
            break;
         case "menu9":
            $("#accordion").accordion("option","active",4);
            menu9Click();
            break;
         case "menu10":
            $("#accordion").accordion("option","active",4);
            menu10Click();
            break;
         case "menu11":
            $("#accordion").accordion("option","active",false);
            menu11Click();
            break;
         case "menu12":
            $("#accordion").accordion("option","active",4);
            menu12Click();
            break;
         case "menu13":
            $("#accordion").accordion("option","active",false);
            menu13Click();
            break;
         case "menu14":
            menu14Click();
            break;
         case "menu15":
            menu15Click();
            break;
         case "menu16":
            menu16Click();
            break;
         case "menu17":
            menu17Click();
            break;
         case "menu18":
            menu18Click();
            break;
         case "menu19":
            menu19Click();
            break;
         case "menu20":
            menu20Click();
            break;
         case "menu21":
            menu21Click();
            break;
         case "menu22":
            menu22Click();
            break;
         case "menu23":
            menu23Click();
            break;
         case "menu24":
            menu24Click();
            break;
         case "menu25":
            menu25Click();
            break;
         case "menu26":
            menu26Click();
            break;
         case "menu27":
            menu27Click();
            break;
         case "menu28":
            menu28Click();
            break;
         case "menu29":
            menu29Click();
            break;
         case "menu30":
            menu30Click();
            break;
         case "menu31":
            //$("#accordion").accordion("option", "collapsible", true);
            $("#menu3").trigger('click');
            //menu3Click();
            break;
         case "menu32":
            $("#menu19").trigger('click');
            //menu19Click();
            break;
         case "menu33":
            $("#menu25").trigger('click');
            //menu25Click();
            break;
         case "menu34":
            menu34Click();
            break;
         case "menu35":
            menu34Click();
            break;
      }
   });
   $(".point11click").click(function () {
      for (var i = 0; i < timeouts.length; i++) {
         clearTimeout(timeouts[i]);
      }
      timeouts = [];
      if (autoplayAnim) autoPauseAllAnimations();
      menu11Fadeout();
      $("#point11text2").fadeIn(500);
      $("#point11text3").fadeIn(500);
      $("#point11text4").fadeIn(500);
      $("#point11text7").fadeIn(500);
      var pointId = this.id;
      console.log("pointId",pointId);
      if (pointId == "point11text2") {
         point11anim1();
      } else if (pointId == "point11text3") {
         point11anim2();
      } else if (pointId == "point11text4") {
         point11anim3();
      } else if (pointId == "point11text7") {
         point11anim4();
      }
   });
});
$(".point6text1Img").click(function () {
   $(".point6text2Img").css('display','none');
   $(".point6text3Img").css('display','none');
   $(".point6text4Img").css('display','none');
   setTimeout(function () {
      $(".point6text1Img").css('display','none');
      scene.groupApplyState("v03");
   },100);
   scene.gotoPosInTime(5.787958966917947,0.1362144303808511,-12.224396010250455,6.851912879392718,253.6235206688435,1000)
});
var firstAnim = true;

function fadingEffect(selector) {
   //    animStoped = false;
   firstAnim = false;
   var width = $("#" + selector).width();
   console.log("width",width);
   for (i = 100; i > 0; i--) {
      $("#" + selector).animate({
         width: i + "%"
      },0.5);
   }
}

var initialLoad = false;
function menuFading() {

   $("#menu14").fadeIn(400,function () {
      $("#menu6").fadeIn(400,function () {
         $("#menu3").fadeIn(400,function () {
            $("#menu19").fadeIn(400,function () {
               $("#menu25").fadeIn(400,function () {
                  $("#menu34").fadeIn(100,function () {
                     $("#menu2").fadeIn(400,function () {
                        $("#menu13").fadeIn(400,function () {

                           $("#menu11").fadeIn(400,function () {
                              $("#menu4").fadeIn(100,function () {
                                 $("#menu15").fadeIn(100,function () {
                                    $("#menu16").fadeIn(100,function () {
                                       $("#menu17").fadeIn(100,function () {
                                          $("#menu18").fadeIn(100,function () {
                                             $("#menu20").fadeIn(100,function () {
                                                $("#menu21").fadeIn(100,function () {
                                                   $("#menu22").fadeIn(100,function () {
                                                      $("#menu23").fadeIn(100,function () {
                                                         $("#menu24").fadeIn(100,function () {

                                                            $("#menu26").fadeIn(100,function () {
                                                               $("#menu27").fadeIn(100,function () {
                                                                  $("#menu28").fadeIn(100,function () {
                                                                     $("#menu29").fadeIn(100,function () {
                                                                        $("#menu30").fadeIn(100,function () {


                                                                           $("#autoPlays").fadeIn(100);
                                                                           objectHide();
                                                                           if (!autoplayCatalog) {
                                                                              setTimeout(function () {
                                                                                 menu14Click();
                                                                                 initialLoad = true;
                                                                              },1000);
                                                                           }
                                                                        })
                                                                     })
                                                                  })
                                                               })
                                                            })
                                                         })
                                                      })
                                                   })
                                                })
                                             })
                                          })
                                       })
                                    })
                                 })
                              })
                           })
                        })
                     })
                  })
               })
            })
         })
      })
   })
}

   
  
function onSuperBlazeReady() {
	 
   scene._jitRadius = 3;
   scene._zNearMin = 5.0;
   if (mob) scene._bDoF = false;
   window.addEventListener('focus',onWindowFocus,false);
   window.addEventListener('blur',onWindowBlur,false);
   //                $("#IntroImageWrapper img").attr("src", "images_gl/Intro/Slide1.svg");
   // scene.gotoPosInTime(0.34657458694860743, 0.07495737146928205, -13.820468569009204, 1.108350778022917, 1.5933977091030724, 1);
   //    scene.gotoPosInTime(3.4088752884305343,0.25396019214692817,-5.517298024926861,0.33870384393014996,230.360871017837297, 1,function(){
   scene.gotoPosInTime(-0.199846,0.045921,-4.80196,5.55286,210.003,1,function () {
      //        scene.groupSet("Nvidia","visible",true);
      //        scene.groupSet("Rack","visible",false);
      //        scene.groupSet("Enclosure","visible",false);
      //        scene.groupSet("Nvidia","Enclosure",false);        
      scene.groupApplyState('SD650_ON');
      scene.groupApplyState('back_new_off');
      scene.groupApplyState('SD650_INTERNAL_OFF');
      scene.groupApplyState('Enclosure_OFF');
      scene.groupApplyState('Nvidia_OFF');
      scene.groupApplyState('Rack_OFF');
      scene.clearRefine();
   });
   end = new Date().getTime();
   var time = end - start;
   if (time < 60000) {
      RT_RecordTiming("Load",time,"Thinksystem SR850_V02_WITH_INTERNAL");
   }
   console.log('End time: ' + time);
   setTimeout(function () {
      showScene();
      $("#reset").css("visibility","visible");
      $("#transPatch2").css("display","none");
      $("#loader,#loader1,#loader2,#transPatch").css("display","none");
      $("#canvasContainer").css("visibility","visible");
      $("#superblazeWrapper").css('display','block');
      $("#superblaze").css('display','block');
      $("#pointtext1 div, #pointtext1 ul").css("display","none");
      $("#transPatch5").css('display','block');
      $('#reset').css('visibility','visible');
      $("#point3Div").css('display','none');
      $("#point5Div").css('display','none');
      $("#transPatchDiv").css('display','none');
      $("#point7Div").css('display','none');
      $("#HeadingDiv").css('display','none');

      if ((navigator.userAgent.indexOf('iPad') != -1) || (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0)) {
         //console.log("ie")
         $("#fullScreen").css('display','none');
         $("#loader,#loader1,#loader2,#transPatch").css("display","none");
      } else {
         $("#fullScreen").css('display','block');
      }
   },500);
   setTimeout(function () {
      if (autoplayCatalog) {
         console.log("autoPlayAllAnimations insuperblaze");
         autoPlayAllAnimations();
      }
   },21000);
   scene.instanceSet("SR850_Remote","visible",false);
   $(".menuitems, .menuitems1").css('display','none');
}

function imgPreLoader() {
   $.preloadImages = function () {
      for (var i = 0; i < arguments.length; i++) {
         $("<img />").attr("src",arguments[i]);
      }
   }
   $.preloadImages("./images_gl/Play.svg","./images_gl/right_popup.svg","./images_gl/Lenovo.svg","./images_gl/lines/0.png","./images_gl/lines/1.png","./images_gl/anybay.png","./images_gl/lines/1.png","./images_gl/lines/0.png","./images_gl/lines/0.png","./images_gl/lines/0.png","./images_gl/lines/1.png","./images_gl/lines/1.png","./images_gl/lines/0.png","./images_gl/lines/0.png","./images_gl/confg/01.png","./images_gl/confg/02.png","./images_gl/confg/03.png","./images_gl/confg/04.png","./images_gl/confg/05.png","./images_gl/anybay.png","./images_gl/lines/1.png","./images_gl/lines/1.png","./images_gl/lines/1.png","./images_gl/lines/1.png","./images_gl/lines/1.png","./images_gl/lines/1.png","./images_gl/lines/1.png","./images_gl/lines/0.png","./images_gl/lines/0.png","./images_gl/lines/0.png","./images_gl/lines/0.png","./images_gl/lines/0.png","./images_gl/lines/3.png","./images_gl/lines/3.png","./images_gl/lines/3.png","./images_gl/lines/3.png","./images_gl/lines/3.png","./images_gl/lines/2.png","./images_gl/lines/2.png","./images_gl/lines/3.png","./images_gl/lines/3.png","./images_gl/lines/3.png","./images_gl/lines/3.png","./images_gl/lines/2.png","./images_gl/lines/2.png","./images_gl/01.png","./images_gl/02.png","./images_gl/03.png","./images_gl/Services/1.png","./images_gl/Services/2.png","./images_gl/Services/3.png","./images_gl/Services/4.png","./images_gl/Services/1_1.png","./images_gl/Services/1_2.png","./images_gl/Services/1_3.png");
}

function UiLoader() {
   $("#hamb img").attr("src","./images_gl/hamburger.png");
   $("#resetBtn img").attr("src","./images_gl/reset.svg");
   $("#lenovo_logo img").attr("src","./images_gl/Lenovo.svg");
   //	$("#fullScreen img").attr("src", "../images_gl/Fullscreen_01.png");
   $("#rightAnim img").attr("src","./images_gl/right_popup.svg");
   $("#pauseplayImg img").attr("src","./images_gl/Play.svg");
   $("#pauseplayImg img").attr("src","./images_gl/Play.svg");
   $("#rightAnim img").attr("src","./images_gl/right_popup.svg");
   $("#lenovo_logo img").attr("src","./images_gl/Lenovo.svg");
   $("#hotspot1plus.plus").attr("src","./images_gl/lines/23.png");
   $("#hotspot2plus.plus").attr("src","./images_gl/lines/22.png");
   $("#hotspot2plus1.plus").attr("src","./images_gl/anybay.png");
   $("#hotspot3plus.plus").attr("src","./images_gl/lines/4.png");
   $("#hotspot4plus.plus").attr("src","./images_gl/lines/5.png");
   $("#hotspot5plus.plus").attr("src","./images_gl/lines/4.png");
   $("#hotspot6plus.plus").attr("src","./images_gl/lines/5.png");
   $("#hotspot7plus.plus").attr("src","./images_gl/lines/22.png");
   $("#hotspot8plus.plus").attr("src","./images_gl/lines/31.png");
   $("#hotspot9plus.plus").attr("src","./images_gl/lines/31.png");
   $("#hotspot10plus.plus").attr("src","./images_gl/lines/31.png");
   $("#point5image1 img").attr("src","./images_gl/confg/01.png");
   $("#point5image2 img").attr("src","./images_gl/confg/02.png");
   $("#point5image3 img").attr("src","./images_gl/confg/03.png");
   $("#point5image4 img").attr("src","./images_gl/confg/04.png");
   $("#point5image5 img").attr("src","./images_gl/confg/05.png")
   $("#point5image6 img").attr("src","./images_gl/anybay.png");
   $("#hotspot11plus.plus").attr("src","./images_gl/lines/31.png");
   $("#hotspot12plus.plus").attr("src","./images_gl/lines/0.png");
   $("#hotspot13plus.plus").attr("src","./images_gl/lines/30.png");
   $("#hotspot14plus.plus").attr("src","./images_gl/lines/22.png");
   $("#hotspot15plus.plus").attr("src","./images_gl/lines/29.png");
   $("#hotspot16plus.plus").attr("src","./images_gl/lines/33.png");
   $("#hotspot17plus.plus").attr("src","./images_gl/lines/32.png");
   $("#hotspot18plus.plus").attr("src","./images_gl/lines/33.png");
   $("#hotspot19plus.plus").attr("src","./images_gl/lines/32.png");
   $("#hotspot20plus.plus").attr("src","./images_gl/lines/36.png");
   $("#hotspot21plus.plus").attr("src","./images_gl/lines/32.png");
   $("#hotspot22plus.plus").attr("src","./images_gl/lines/32.png");
   $("#hotspot23plus.plus").attr("src","./images_gl/lines/22.png");
   $("#hotspot24plus.plus").attr("src","./images_gl/lines/21.png");
   $("#hotspot25plus.plus").attr("src","./images_gl/lines/22.png");
   $("#hotspot26plus.plus").attr("src","./images_gl/lines/22.png");
   $("#hotspot27plus.plus").attr("src","./images_gl/lines/22.png");
   $("#hotspot28plus.plus").attr("src","./images_gl/lines/22.png");
   $("#hotspot28plus1.plus").attr("src","./images_gl/lines/22.png");
   $("#hotspot29plus.plus").attr("src","./images_gl/lines/39.png");
   $("#hotspot30plus.plus").attr("src","./images_gl/lines/3.png");
   $("#hotspot50plus.plus").attr("src","./images_gl/lines/3.png");
   $("#hotspot31plus.plus").attr("src","./images_gl/lines/55.png");
   $("#hotspot32plus.plus").attr("src","./images_gl/lines/21.png");
   $("#hotspot33plus.plus").attr("src","./images_gl/lines/22.png");
   $("#hotspot34plus.plus").attr("src","./images_gl/lines/0.png");
   $("#hotspot35plus.plus").attr("src","./images_gl/lines/0.png");
   $("#hotspot36plus.plus").attr("src","./images_gl/lines/22.png");
   $("#point10image1 img").attr("src","./images_gl/01.png");
   $("#pont10Img1 img").attr("src","./images_gl/02.png");
   $("#pont10Img2 img").attr("src","./images_gl/03.png");
   //    $("#home img").attr("src","./superblaze_demo_images/reset.png");
   $("#point11image1 img").attr("src","images_gl/Services/1.png");
   $("#point11image2 img").attr("src","images_gl/Services/2.png");
   $("#point11image3 img").attr("src","images_gl/Services/3.png");
   $("#point11image4 img").attr("src","images_gl/Services/4.png");
   $("#point11image5 img").attr("src","images_gl/Services/5.png");
   $("#point11image1_1 img").attr("src","images_gl/Services/1_1.png");
   $("#point11image1_2 img").attr("src","images_gl/Services/1_2.png");
   $("#point11image1_3 img").attr("src","images_gl/Services/1_3.png");
   $("#point11image1_4 img").attr("src","images_gl/Services/1_4.png");
   $("#point7image1 img").attr("src","images_gl/intel.png");
   $("#point8image1 img").attr("src","images_gl/intel.png");
   $("#hotspot40plus.plus").attr("src","./images_gl/lines/4.png");
   $("#hotspot41plus.plus").attr("src","./images_gl/lines/4.png");
   $("#hotspot42plus.plus").attr("src","./images_gl/lines/4.png");
   $("#hotspot43plus.plus").attr("src","./images_gl/lines/22.png");
   $("#hotspot44plus.plus").attr("src","./images_gl/lines/22.png");
   $("#hotspot45plus.plus").attr("src","./images_gl/lines/33.png");
   $("#hotspot46plus.plus").attr("src","./images_gl/lines/32.png");
   $("#hotspot47plus.plus").attr("src","./images_gl/lines/33.png");
   $("#hotspot48plus.plus").attr("src","./images_gl/lines/32.png");
   $("#hotspot49plus.plus").attr("src","./images_gl/lines/33.png");
   $("#hotspot51plus.plus").attr("src","./images_gl/lines/32.png");
   $("#hotspot52plus.plus").attr("src","./images_gl/lines/32.png");
   $("#point13text .point13text2").attr("src","./images_gl/LiCo_cluster/LiCO_Picture1.png");
   $("#point13text .point13text3").attr("src","./images_gl/LiCo_cluster/LiCO_Picture2.png");
   $("#point13text .point13text4").attr("src","./images_gl/LiCo_cluster/LiCO_Picture3.png");
   $("#point13text .point13text5").attr("src","./images_gl/LiCo_cluster/LiCO_Picture4.png");
   $("#point6text .point6text1Img").attr("src","./images_gl/Server03.jpg");
   $("#point6text .point6text2Img").attr("src","./images_gl/Server02.jpg");
   $("#point6text .point6text4Img").attr("src","./images_gl/Server02.jpg");
   $("#point6text .point6text3Img").attr("src","./images_gl/Server01.jpg");
   $("#point7text .Point7Img").attr("src","./images_gl/Picture5.png");


   /*$("#point13img2 img").attr("src", "./images_gl/LiCo_cluster/LiCO_Picture1.png")
   $("#point13img3 img").attr("src", "./images_gl/LiCo_cluster/LiCO_Picture2.png")
   $("#point13img4 img").attr("src", "./images_gl/LiCo_cluster/LiCO_Picture3.png")
   $("#point13img5 img").attr("src", "./images_gl/LiCo_cluster/LiCO_Picture4.png")*/

   $("#point15text .point15Img").attr("src","./images_gl/Picture5.png");
   $("#point14text .point14Img").attr("src","./images_gl/Picture5.png");
   $("#point21text .point21Img").attr("src","./images_gl/Picture5.png");
   $("#point2text .point2Img").attr("src","./images_gl/intel-xenon.png");
   $("#point27text .point27Img").attr("src","./images_gl/Picture5.png");
   $("#playVideos1").append('<video id="screen-video1" width="100%" style="margin:0;" loop><source id="screen-video-src1" type="video/mp4" src="./media/4xSUM.mp4"></video>');
   $("#playVideos2").append('<video id="screen-video2" width="100%" style="margin:0;" loop><source id="screen-video-src2" type="video/mp4" src="./media/8xDW.mp4"></video>');
   $("#playVideos3").append('<video id="screen-video3" width="100%" style="margin:0;" loop><source id="screen-video-src3" type="video/mp4" src="./media/8xSW.mp4"></video>');
   imgPreLoader();
   var img = new Image();
   img.onload = function () { }
}

var videoplay = false;
function playVid(vid) {
   console.log("===",vid)
   vid.play();
   videoplay = true;
   //        vid.loop();
}

function pauseVid() {
   vidx1.pause();
   vidx2.pause();
   vidx3.pause();
}

function stopVid() {
   videoplay = false;
   vidx1.pause();
   vidx2.pause();
   vidx3.pause();
   vidx1.currentTime = 0;
   vidx2.currentTime = 0;
   vidx3.currentTime = 0;
}
$(document).ready(function () {
   try {
      parent.document;
      // accessible
      resizePage(window.parent.document.documentElement.clientWidth,window.parent.document.documentElement.clientHeight);
      if (window.parent.parent.bandwidth) {
         autoplayCatalog = window.top.document.getElementById("mainpanel2").contentWindow.autoplayCatalog;
         ////console.log("content window"+autoplayCatalog);
      } else {
         autoplayCatalog = false;
         $("#home").css("display","none");
         $("#backText").css("display","none");
      }
      $(window.parent).bind('resize',function () {
         resizePage(window.parent.innerWidth,window.parent.innerHeight);
      });
      window.onresize = function (event) {
         resizePage(window.parent.innerWidth,window.parent.innerHeight);
      }
      $(window).bind("fullscreen-toggle",function (e,state) {
         ////console.log("full toggle");
         resizePage(window.parent.document.documentElement.clientWidth,window.parent.document.documentElement.clientHeight);
      });
   } catch (e) {
      // not accessible
      resizePage(window.document.documentElement.clientWidth,window.document.documentElement.clientHeight);
      autoplayCatalog = false;
      $("#home").css("display","none");
      $("#backText").css("display","none");
      $(window).bind('resize',function () {
         resizePage(window.innerWidth,window.innerHeight);
      });
      window.onresize = function (event) {
         resizePage(window.innerWidth,window.innerHeight);
      }
      $(window).bind("fullscreen-toggle",function (e,state) {
         ////console.log("full toggle");
         resizePage(window.document.documentElement.clientWidth,window.document.documentElement.clientHeight);
      });
   }
});

function SuperblazeStart(gl) {
   try {
      parent.document;
      resizePage(document.documentElement.clientWidth,document.documentElement.clientHeight);
      $(window).resize(function () {
         resizePage(document.documentElement.clientWidth,document.documentElement.clientHeight);
      });
   } catch (e) {
      resizePage(document.documentElement.clientWidth,document.documentElement.clientHeight);
      $(window).resize(function () {
         resizePage(document.documentElement.clientWidth,document.documentElement.clientHeight);
      });
   }
   canvas = document.getElementById("superblaze-canvas");
   var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
   if ((navigator.userAgent.indexOf("iPhone") != -1) || ((navigator.userAgent.indexOf("Android") != -1) || (navigator.userAgent.indexOf("Mobile") != -1)) || (navigator.userAgent.indexOf('iPod') != -1)) {
      //        scene = new infinityrt_scene(gl, "../v5/model_gl/", canvas.width, canvas.height);
      scene = new infinityrt_scene(gl,"model_gl/",canvas.width,canvas.height,undefined,undefined,undefined,InitialSceneState,AllGeometryComplete);
      //console.log("mob");
   } else {
      //        scene = new infinityrt_scene(gl, "../v5/model_gl/", canvas.width, canvas.height);
      scene = new infinityrt_scene(gl,"model_gl/",canvas.width,canvas.height,undefined,undefined,undefined,InitialSceneState,AllGeometryComplete);
      //console.log("desk");
   }
   scene.fnLoadProgress = updateProgressBar;
   scene.start();
   scene._nav = new infinityrt_navigation(scene,canvas.width,canvas.height);
   _scenePollInterval = setInterval("isSuperblazeReady()",100);
   start = new Date().getTime();
   //    NavInit(canvas.width, canvas.height);
   var canvasDummy = document.getElementById("dummy-canvas");
   addMouseListeners(canvasDummy);
   /* scene._slowinoutfac = 0.9;*/
   if (scene != null) {
      window.requestAnimationFrame(frameUpdate);
      $(this).bind("contextmenu",onRightClick); //prevents a right click     
      document.body.oncontextmenu = onRightClick;
      //window.addEventListener('oncontextmenu',onRightClick,false);
      //if (typeof(onInit()) != 'undefined') onInit();
   }
   initDragCursor();
}
var AllgeoIntl = false;
var InHotspot = false;

function InitialSceneState() {
   InHotspot = true;
}

function AllGeometryComplete() {
   AllgeoIntl = true;
   console.log('All time: ' + (new Date().getTime() - start));
   vidx1 = document.getElementById("screen-video1");
   vidx2 = document.getElementById("screen-video2");
   vidx3 = document.getElementById("screen-video3");
}
var mob = (navigator.userAgent.indexOf("iPhone") != -1) || ((navigator.userAgent.indexOf("Android") != -1) || (navigator.userAgent.indexOf("Mobile") != -1)) || (navigator.userAgent.indexOf('iPod') != -1);
var FullscreenOff = false;

function launchFullscreen(element) {
   //    window.parent.fullScreen=true;
   //    resizePage(window.parent.document.documentElement.clientWidth,window.parent.document.documentElement.clientHeight);
   //    if(navigator.userAgent.indexOf('MSIE')!==-1 || navigator.appVersion.indexOf('Trident/') > 0){
   //        //console.log("IE 11");
   //        $("#fullScreenOff").css('display','none'); 
   //        $("#fullScreen").css('display','none');
   //        
   //    }else{
   //      //  console.log("Not IE 11");
   //        $("#fullScreenOff").css('display','block'); 
   //        $("#fullScreen").css('display','none');
   //    }
   //    
   //   // console.log(" full screen ");
   //    if(element.requestFullscreen) {
   //        element.requestFullscreen();
   //    } else if(element.mozRequestFullScreen) {
   //        element.mozRequestFullScreen();
   //    } else if(element.webkitRequestFullscreen) {
   //        element.webkitRequestFullscreen();
   //    } else if(element.msRequestFullscreen) {
   //        element.msRequestFullscreen();
   //    }
   //setTimeout(function(){resizePage(window.parent.document.documentElement.clientWidth,window.parent.document.documentElement.clientHeight);;}, 2000);
}

function exitFullscreen() {
   // console.log("Exit full screen");
   //    window.parent.fullScreen=false;
   //    $("#fullScreenOff").css('display','none'); 
   //    $("#fullScreen").css('display','block');  
   //    if (window.parent.document.exitFullscreen) {
   //        window.parent.document.exitFullscreen();
   //    } else if (window.parent.document.mozCancelFullScreen) {
   //        window.parent.document.mozCancelFullScreen();
   //    } else if (window.parent.document.webkitExitFullscreen) {
   //        window.parent.document.webkitExitFullscreen();
   //    }
   //    setTimeout(function() {
   //        resizePage(window.parent.document.documentElement.clientWidth, window.parent.document.documentElement.clientHeight);
   //    }, 40);
}
window.document.onkeyup = function (e) {
   // console.log("ECS pressed IE1");
   if (e.keyCode == 27) {
      // if(navigator.userAgent.indexOf('MSIE')!==-1 || navigator.appVersion.indexOf('Trident/') > 0){
      //    // console.log("ECS pressed IE");
      // }
      // console.log("ECS pressed"); 
      // exitFullscreen(window.parent.document.documentElement);
      var iE = 0;
      var _intervalEsc = setInterval(function () {
         if (iE < 5) {
            // console.log("func"+iE);
            //                exitFullscreen(window.parent.document.documentElement);
            iE++;
         } else {
            clearInterval(_intervalEsc);
         }
      },10);
   }
}
var FullscreenOn = false;

function resizePage(width,height) {
   // console.log("resize")
   // alert("Resize page width: "+width+" height: "+height);
   if ((navigator.userAgent.indexOf('iPad') != -1)) {
      width = document.documentElement.clientWidth;
      height = document.documentElement.clientHeight;
   }
   if (mob) {
      $("#fullScreen").css('display','none');
   } else if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
      // console.log("IE 11");
      $("#fullScreenOff").css('display','none');
      $("#fullScreen").css('display','none');
   } else {
      $("#fullScreenOff").css('display','none');
      $("#fullScreen").css('display','none');
   }
   //    
   //      FullscreenOn=window.parent.fullScreen;
   //// console.log(" resize page flscreen "+width+" "+height);
   if (mob) {
      jQuery("#dummy-canvas").detach().appendTo('#maincanvasContainer');
      jQuery("#superblaze-canvas").detach().appendTo('#canvasContainer');
      $("#superblaze-canvas").attr({
         width: '1024px',
         height: '576px'
      });
   }
   var s;
   if (FullscreenOn == true) {
      if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
         // console.log("IE 11 FS on");
         $("#fullScreenOff").css('display','none');
         $("#fullScreen").css('display','none');
      } else {
         // console.log("Not IE 11");
         $("#fullScreenOff").css('display','block');
         $("#fullScreen").css('display','none');
      }
      // $("#fullScreenOff").css('display','block');
      // $("#fullScreen").css('display','none'); 
      if (width > 1920) {
         width = 1920;
      }
      if (height > 1080) {
         height = 1080;
      }
   } else {
      if (mob) {
         $("#fullScreen").css('display','none');
      } else {
         $("#fullScreen").css('display','block');
         $("#fullScreenOff").css('display','none');
      }
      if (width > 1920) {
         width = 1920;
      }
      if (height > 1080) {
         height = 1080;
      }
   }
   var w = eval(width / 1286);
   var h = eval(height / 723);
   if (w < h || (navigator.userAgent.indexOf('iPad') != -1)) {
      // console.log("Resize page2 width: "+width+" height: "+height);
      //// console.log(" width ...");
      s = w;
      sceneDivW = width;
      sceneDivH = 1080 * width / 1920;
      //if(s<0.815 || mob){
      $("#scenediv").css({
         'width': "1284px",
         'height': "721px"
      });
      $("#dummy-canvas").css({
         'width': "1284px",
         'height': "721px"
      });
      /*}else{
         $("#scenediv").css({'width':sceneDivW,'height':sceneDivH});
         $("#dummy-canvas").css({'width':sceneDivW,'height':sceneDivH});
      }*/
      var div = document.getElementById("superblaze-canvas");
      if (div.getBoundingClientRect) {
         var rect = div.getBoundingClientRect();
         new_w = rect.right - rect.left;
         new_h = rect.bottom - rect.top;
      }
      if ((navigator.userAgent.indexOf('iPad') != -1)) {
         // console.log("resizing ipad....."+mob);
         $('#superblaze').css({
            'margin-left': 0,
            'margin-top': 0
         });
         $("#superblazeWrapper").css({
            'margin-left': 0,
            'margin-top': 0
         });
         $('#canvasContainer').css({
            'margin-left': 0,
            'margin-top': 0
         });
         //            $("#menubar").removeClass("menuitems");
         $("menuitems").hover(function () {
            $(this).css("background-color","yellow");
         });
      } else if (mob) {
         // console.log("resizing mob....."+mob);
         $('#superblaze').css({
            'margin-left': (($(window).width() - new_w) / 2),
            'margin-top': 0
         });
         $("#superblazeWrapper").css({
            'margin-left': (($(window).width() - new_w) / 2),
            'margin-top': 0
         });
         $('#canvasContainer').css({
            'margin-left': (($(window).width() - new_w) / 2),
            'margin-top': 0
         });
      } else {
         // console.log("resizing else....."+mob);
         $('#superblaze').css({
            'margin-left': (($(window).width() - new_w) / 2),
            'margin-top': parseInt(window.innerHeight - new_h) / 2
         });
         $("#superblazeWrapper").css({
            'margin-left': (($(window).width() - new_w) / 2),
            'margin-top': parseInt(window.innerHeight - new_h) / 2
         });
         $('#canvasContainer').css({
            'margin-left': (($(window).width() - new_w) / 2),
            'margin-top': parseInt(window.innerHeight - new_h) / 2
         });
      }
   } else {
      // console.log("height 22...");
      s = h;
      sceneDivH = height;
      sceneDivW = 1920 * height / 1080;
      // if(s < 0.815 || mob){
      $("#scenediv").css({
         'width': "1284px",
         'height': "721px"
      });
      $("#dummy-canvas").css({
         'width': "1284px",
         'height': "721px"
      });
      /* }else{
          $("#scenediv").css({'width':sceneDivW,'height':sceneDivH});
          $("#dummy-canvas").css({'width':sceneDivW,'height':sceneDivH});
       }*/
      var div = document.getElementById("superblaze-canvas");
      if (div.getBoundingClientRect) {
         var rect = div.getBoundingClientRect();
         new_w = rect.right - rect.left;
         new_h = rect.bottom - rect.top;
      }
      if ((navigator.userAgent.indexOf('iPad') != -1)) {
         // console.log("resizing mob2....."+mob);
         $('#superblaze').css({
            'margin-left': 0,
            'margin-top': 0
         });
         $("#superblazeWrapper").css({
            'margin-left': 0,
            'margin-top': 0
         });
         $('#canvasContainer').css({
            'margin-left': 0,
            'margin-top': 0
         });
      } else {
         // console.log("resizing else2....."+mob);
         $('#superblaze').css({
            'margin-left': (($(window).width() - new_w) / 2),
            'margin-top': parseInt(window.innerHeight - new_h) / 2
         });
         $("#superblazeWrapper").css({
            'margin-left': (($(window).width() - new_w) / 2),
            'margin-top': parseInt(window.innerHeight - new_h) / 2
         });
         $('#canvasContainer').css({
            'margin-left': (($(window).width() - new_w) / 2),
            'margin-top': parseInt(window.innerHeight - new_h) / 2
         });
      }
   }
   if (mob) {
      $("#close").css("display","none");
      $("#fullScreen").css('display','none');
   } else {
      $("#zoomSliderContainer").css("display","block");
   }
   //// console.log("else ...");
   $("#superblaze").css({
      'transform': 'scale(' + s + ')',
      'transform-origin': '0% 0%',
      '-webkit-transform': 'scale(' + s + ')',
      '-webkit-transform-origin': '0% 0%',
      '-moz-transform': 'scale(' + s + ')',
      '-moz-transform-origin': '0% 0%',
      '-o-transform': 'scale(' + s + ')',
      '-o-transform-origin': '0% 0%',
      '-ms-transform': 'scale(' + s + ')',
      '-ms-transform-origin': '0% 0%',
   });
   $("#superblazeWrapper").css({
      'transform': 'scale(' + s + ')',
      'transform-origin': '0% 0%',
      '-webkit-transform': 'scale(' + s + ')',
      '-webkit-transform-origin': '0% 0%',
      '-moz-transform': 'scale(' + s + ')',
      '-moz-transform-origin': '0% 0%',
      '-o-transform': 'scale(' + s + ')',
      '-o-transform-origin': '0% 0%',
      '-ms-transform': 'scale(' + s + ')',
      '-ms-transform-origin': '0% 0%',
   });
   var ccs = s / 1.493001;
   if (mob) {
      ccs = s / 0.79626;
   }
   $("#canvasContainer").css({
      'transform': 'scale(' + ccs + ')',
      'transform-origin': '0% 0%',
      '-webkit-transform': 'scale(' + ccs + ')',
      '-webkit-transform-origin': '0% 0%',
      '-moz-transform': 'scale(' + ccs + ')',
      '-moz-transform-origin': '0% 0%',
      '-o-transform': 'scale(' + ccs + ')',
      '-o-transform-origin': '0% 0%',
      '-ms-transform': 'scale(' + ccs + ')',
      '-ms-transform-origin': '0% 0%',
   });
}

function addMouseListeners(canvas) {
   canvas.addEventListener('mousemove',mouseMove,false);
   canvas.addEventListener('mousedown',mouseDown,false);
   canvas.addEventListener('mouseup',mouseUp,false);
   canvas.addEventListener('mousewheel',mouseWheel,false);
   canvas.addEventListener('DOMMouseScroll',mouseWheel,false);
   canvas.addEventListener('mouseout',mouseOut,false);
   canvas.addEventListener('touchstart',touchStart,false);
   canvas.addEventListener('touchmove',touchMove,false);
   canvas.addEventListener('touchend',touchEndCan,false);
   document.getElementById('rightAnim').addEventListener('mousedown',rightAnimClick,false);
   document.getElementById("home").addEventListener("mousedown",closeSuperblaze);
}
var rightAnimToggle = true;
var animblockStopped = true;
var timeoutsnew = [];
var timeouts = [];
/*abhijitend*/
function rightAnimClick() {
   if (rightAnimToggle) {
      $("#rightAnim").animate({
         right: '0px'
      },"slow");
      rightAnimToggle = false;
   } else {
      $("#rightAnim").animate({
         right: '-235px'
      },"slow");
      rightAnimToggle = true;
   }
}

function mouseDownHide() {
   $(".point3headingText").css("opacity","0");
   $(".point6headingText").css("opacity","0");
   $(".point7headingText").css("opacity","0");
   $(".point7text1").css("opacity","0");
   $("#point7image1").css("opacity","0");
   $(".point8headingText").css("opacity","0");
   $(".point8text1").css("opacity","0");
   $("#point8image1").css("opacity","0");
   $(".point20headingText").css("opacity","0");
}

function divHide() {
   //   $("#point3Div").fadeOut(500); 
   //   $("#point5Div").fadeOut(500);
   //   $("#point7Div").fadeOut(500);
   //   $("#HeadingDiv").css('display','none'); 
   //   $("#HeadingDiv2").css('display','none'); 
   //   $("#point8text").css('display','none'); 
}

function CalloutsHide() {

   $("#hotspot1").css('display','none');
   $("#hotspot2").css('display','none');
   $("#hotspot3").css('display','none');
   $("#hotspot4").css('display','none');
   $("#hotspot5").css('display','none');
   $("#hotspot19").css('display','none');
   $("#hotspot20").css('display','none');
   $("#hotspot21").css('display','none');
   $("#hotspot22").css('display','none');
   $("#hotspot23").css('display','none');
   $("#hotspot24").css('display','none');
   $("#hotspot40").css('display','none');
   $("#hotspot41").css('display','none');
   $("#hotspot42").css('display','none');
   $("#hotspot43").css('display','none');
   $("#hotspot44").css('display','none');
   $("#hotspot45").css('display','none');
   $("#hotspot46").css('display','none');
   $("#hotspot47").css('display','none');
   $("#hotspot48").css('display','none');
   $("#hotspot49").css('display','none');
   $("#hotspot50").css('display','none');
   $("#hotspot019").css('display','none');
   $("#hotspot020").css('display','none');
   $("#hotspot021").css('display','none');
   $("#hotspot022").css('display','none');
   $("#hotspot023").css('display','none');
   $("#hotspot024").css('display','none');
   //$("#hotspot511").css('display', 'none');
   $("#hotspot522").css('display','none');
   $("#hotspot533").css('display','none');
}

function objectHide() {
   //  console.log("inobjects hide funt");
   //    $("#onloadCopy").css("opacity","0");
   //    $("#transPatch3").css('display','none');
   //    $("#Horizontal_Plate").css('display','none');
   //    $("#bottomPlate_white").css('display','none');
   //    $("#point4Div").css('display','none');  
   //    $("#point2text").css('display','none');
   //    $("#point3text").css('display','none');
   //    $("#point5text").css('display','none');
   //    $("#point4text").css('display','none');
   //    $("#point3text").css('display','none');
   //    $("#point6text").css('display','none');
   //    $("#point7text").css('display','none');
   $("#point14text").css('display','none');
   $("#point14text1").css('display','none');
   $("#point21text").css('display','none');
   $("#point22text").css('display','none');
   $("#point23text").css('display','none');
   $("#point25text").css('display','none');
   $("#point27text").css('display','none');
   $("#point28text").css('display','none');
   $("#point15text").css('display','none');
   /* scene.groupApplyState('SXM_NVLink_GPU_Card_OFF');
   scene.groupApplyState('8x_DW_PCle_GPU_Card_OFF');
   scene.groupApplyState('4x_DW_PCle_GPU_Card_OFF'); */
   CalloutsHide();
   //    $("#transPatchDiv").css('display','none');
   setTimeout(function () {
      clickEventActive = true;
   },100);
   scene.clearRefine();
   //    clearTimeout(a);
}

function hideAllObjects() {
   //scene.animPlayInTime("Cover", 0, 1);
   scene.groupApplyState('all_off');
   //    scene.groupApplyState('Internal_Hide');
   //    scene.groupApplyState('internal_hide');
   //    scene.groupApplyState('Cooling_OFF');
   scene.groupApplyState('top_close');

}

function hideCallouts() {
   $("#point16text").css('display','none');
   $("#point17text").css('display','none');
   $("#point18text").css('display','none');
   //$("#point20text").css('display', 'none');
   $("#point23text").css('display','none');
   $("#point24text").css('display','none');
   $("#point26text").css('display','none');
   $("#point29text").css('display','none');
   $("#point30text").css('display','none');
   $("#point34text").css('display','none');
}


var open = false;
var close = false;
var storage_dfr = false;
var a;

var menu7clicked = false;
var menu9clicked = false;
var menu8Clicked = false;
var menu9Clicked = false;
var menu10clicked = false;
var menu11Clicked = false;

function menu2Click() {
   console.log("menu2Clicked");
   //    scene._nav._navMinDolly = 680;
   hideAllObjects();
   objectHide();
   hideCallouts();
   animStoped = false;
   scene._nav._navMaxDolly = 200.0;
   $("#onloadCopy").css('display','none');
   $("#cpHeading").html("3<sup>rd</sup> Gen Intel® Xeon® Platinum Processors");
   $("#transparentPatch").css('display','none');
   scene.groupApplyState('8x_sw');
   scene.groupApplyState('back_new_off');
   scene.gotoPosInTime(3.1385557189741615,1.5079644737231006,-5,4,170,1000,function () {
      scene.groupApplyState('top_open');
   });
   startAutorot = timeouts.push(setTimeout(function () {
      $("#point16text").css('display','none');
      $("#point17text").css('display','none');
      $("#point18text").css('display','none');
      $("#point20text").css('display','none');
      $("#point23text").css('display','none');
      $("#point24text").css('display','none');
      $("#point26text").css('display','none');

      $("#point29text").css('display','none');
      $("#point30text").css('display','none');
      //autoRotateCall();
      console.log("autoRotateCall");
   },5000));
   timeouts.push(setTimeout(function () {
      //$("#onloadCopy").fadeIn(400);
      $("#point2text").fadeIn(400);
      timeouts.push(setTimeout(function () {
         translateIn(2);
         animComplete();
      },200));
      if (autoplayAnim) {
         animCompeteAuto();
      }
      $("#onloadCopy").css({
         "webkitTransform": "translate(0,-5px)",
         "MozTransform": "translate(0,-5px)",
         "msTransform": "translate(0,-5px)",
         "OTransform": "translate(0,-5px)",
         "transform": "translate(0,-5px)",
         "opacity": 1
      });
   },2050));
   scene.clearRefine();
   menu9clicked = false;
   menu7clicked = false;
}


function menu3Click() {
   console.log("menu3click");
   hideAllObjects();
   objectHide();
   hideCallouts();
   animStoped = false;
   $("#onloadCopy").css('display','block');
   $("#cpHeading").text("4x NVIDIA HGX-A40 4-GPU Configuration");
   $("#transparentPatch").css("display","none");
   $("#menu3").addClass("active");
   scene.groupApplyState('4x_sxw');
   scene.groupApplyState('back_new_off');
   scene.gotoPosInTime(0.5523139438569467,0.1959522246928204,-15.517298024926861,7.3387038439301504,230.3608710178373,1000,(function () { }));
   timeouts.push(setTimeout(function () {
      $("#point20text").css('display','none');
      translateIn(3);
      //$("#point3text").css("display", "block");
      $("#point3text").fadeIn(200);
      $(".point1text1").fadeOut(200);
      //         $("#point3headingText").fadeIn(200); 
      animComplete();
      timeouts.push(setTimeout(function () {
         if (autoplayAnim) {
            animCompeteAuto();
         }

      },3300));

      scene.animPlayInTime("Top_Cover_Animation",1,1000);
      scene.clearRefine();
   },2250));
   timeouts.push(setTimeout(function () {
      scene.instanceSet("Top_Cover_Animation","visible",false);
      scene.clearRefine();
      autoRotateCall();
   },3250));
   menu9clicked = false;
   menu7clicked = false;
   scene.clearRefine();
}

function menu4Click() {
   console.log("menu4Clicked");

   objectHide();
   hideAllObjects();
   animStoped = false;
   hideCallouts();
   $("#cpHeading").text("Lenovo Neptune™ Hybrid Liquid Cooling Technology");
   // $("#point4text").css('display', 'block');
   $("#onloadCopy").css('display','none');
   //    scene.instanceSet("SR850_V02_WITH_INTERNAL", "visible", true);
   //    scene.instanceSet("SR850_Remote", "visible", false);
   $("#menu3").addClass("active");
   $("#menu").parents().prev(".menuitems").addClass("active")
   $("#menu4").removeClass("disabled");
   $("#menu4").removeClass('active');
   $(".greyOutBox").removeClass('redOutBox');
   $("#menu4 .greyOutBox").addClass('redOutBox');

   //	scene.groupApplyState('4x_sxw');
   //	scene.groupApplyState('top_open');
   //    scene.groupApplyState('Cooling_ON');
   //    scene.gotoPosInTime(3.9560685882054253, 0.4779644737231007, -12.80196, 9.55286, 243.003, 1000, function () {
   //   scene.gotoPosInTime(0.7395499476925033,0.52463114038976706, -17.80196, 9.55286, 253.003, 1000, function () {
   //		scene.instanceSet("Remote", "visible", true);
   //		scene.instanceSet("SR850_Remote", "visible", true);
   //		scene.instanceSet('SR850_Remote_1_polySurface10', 'visible', false);
   //		scene.clearRefine();
   //	});
   timeouts.push(setTimeout(function () {
      $('#playVideos1').css('display','block');
      playVid(vidx1);
      $("#point4text").fadeIn(400);
      translateIn(4);
      animComplete();
   },200));
   timeouts.push(setTimeout(function () {
      if (autoplayAnim) {
         animCompeteAuto();
      }

   },3300));
   menu9clicked = false;
   menu7clicked = false;
   scene.clearRefine();
}

function menu5Click() {
   console.log("menu5Clicked");
   hideAllObjects();
   objectHide();
   animStoped = false;
   //    scene._nav._panMax =  [38, 17];
   //    scene._nav._panMin =  [-42, -7];
   $("#onloadCopy").css('display','none');
   $(".point5headingText").css('opacity','1');
   $("#cpHeading").text("ThinkSystem SD650-N V2 Direct Water Cooling");
   menu5clicked = true;

   $("#menu").parents().prev(".menuitems").addClass("active");
   $("#menu5").removeClass("disabled");
   $("#menu5").removeClass('active');
   $(".greyOutBox").removeClass('redOutBox');
   $("#menu5 .greyOutBox").addClass('redOutBox');
   // $("#cpHeading").text("Rear View");
   scene.groupApplyState('SD650_ON');
   scene.groupApplyState('SD650_INTERNAL_ON');
   scene.groupApplyState('GPU_LIGHT_OFF');
   scene.groupApplyState('SD650_TOP_COVER_OFF');
   scene.groupApplyState('Enclosure_OFF');
   scene.groupApplyState('Nvidia_OFF');
   scene.groupApplyState('Rack_OFF');
   scene.clearRefine();
   scene.clearRefine();
   scene.gotoPosInTime(4.708010220143732,1.4946444737231004,-12.224396010250455,6.851912879392718,253.62352066884349,1000);
   timeouts.push(setTimeout(function () {
      scene.animPlayInTime("Top_Cover_Animation",1,1000);
      scene.clearRefine();
   },2000));
   timeouts.push(setTimeout(function () {
      $("#point5text").fadeIn(400);
      scene.instanceSet("Top_Cover_Animation","visible",false);
      scene.clearRefine();
   },2700));
   timeouts.push(setTimeout(function () {
      //           $("#point5headingText").fadeIn(400);
      translateIn(6);
      animComplete();

   },2000));
   timeouts.push(setTimeout(function () {
      if (autoplayAnim) {
         animCompeteAuto();
      }

   },2600));
   scene.clearRefine();
   menu9clicked = false;
   menu7clicked = false;
}

function menu6Click() {
   console.log("menu6Clicked");
   objectHide();

   hideAllObjects();
   hideCallouts();
   animStoped = false;

   //    scene._nav._panMax =  [38, 17];
   //    scene._nav._panMin =  [-42, -7];
   $("#onloadCopy").css('display','none');
   menu6clicked = true;

   $("#cpHeading").html("From Exascale to Everyscale&trade;");
   scene.groupApplyState('back_new_off');
   $("#point14text").css('display','none');

   //scene.gotoPosInTime(4.708010220143732, 1.4946444737231004, -12.224396010250455, 6.851912879392718, 253.62352066884349, 1000);
   timeouts.push(setTimeout(function () {
      //        scene.animPlayInTime("Cover", 0, 1);
      //        scene.instanceSet("Cover", "visible", true);
      //        $('#playVideos').css('display', 'block');
      //        playVid(vidx);
      scene.clearRefine();
   },2000));
   timeouts.push(setTimeout(function () {
      $("#point6text").fadeIn(400);
      $(".point6text4").fadeIn(400);
      $(".point6text5").fadeIn(400);
      $(".point6text7").fadeIn(400);
      $(".point6text9").fadeIn(400);
      translateIn(6);
      $(".point6text1Img").css('display','block');
      $(".point6text2Img").css('display','block');
      $(".point6text3Img").css('display','block');
      $(".point6text4Img").css('display','block');
      animComplete();
      if (autoplayAnim) {
         animCompeteAuto();
      }
   },300));
   scene.clearRefine();
   menu9clicked = false;
   menu7clicked = false;
}

function menu7Click() {
   console.log("menu7_click");
   hideAllObjects();
   objectHide();
   animStoped = false;
   //    $("#cpHeading").text("Interior – 2 Processor, 24 DIMM");
   $("#cpHeading").html("NVIDIA&reg; A40 40GB SXM4 Graphics Processing Unit (GPU)");
   $("#onloadCopy").css('display','none');
   //    $("#onloadCopy").css("opacity","0").fadeOut(400);
   //    $("#menu9,#menu10").removeClass("disabled");

   scene.gotoPosInTime(-0.7715167303121322,0.8455580327856126,-1.194294717652605,0.634411292428634,40,1000);
   if (!menu9clicked) {
      scene._nav._navMinDolly = 40;
      console.log("menu7_if");
      //         scene.instanceSet("Cover","visible",true); 
      scene.clearRefine();
      scene.animPlayInTime("Trey_Handle",0,1);
      scene.animPlayInTime("Ex_Tray",0,1);
      scene.animPlayInTime("Ex_Tray_center",0,1);
      //       scene.animPlayInTime("Cover",0,1);
      timeouts.push(setTimeout(function () {
         scene.gotoPosInTime(-0.7715167303121322,0.8455580327856126,-1.194294717652605,0.634411292428634,40,1000,function () {
            $("#point7text .Point7Img").css("display","block");
            //             scene.groupApplyState('Nvidia_ON');
            ////                scene.groupApplyState('SD650_OFF');
            ////        scene.groupApplyState('Enclosure_OFF'); 
            ////        scene.groupApplyState('Rack_OFF');     
            scene.clearRefine();
         });
      },800));
      timeouts.push(setTimeout(function () {
         scene.animPlayInTime("Cover",1,2000,function () {
            scene.instanceSet("Cover","visible",false);
            scene.clearRefine();
         });
      },2500));
      timeouts.push(setTimeout(function () {
         $("#point7text").fadeIn(400);
         translateIn(7);
      },4000));
      timeouts.push(setTimeout(function () {
         animComplete();
         if (autoplayAnim) {
            animCompeteAuto();
         }
      },4500));
      scene.clearRefine();
      menu7clicked = true;
      menu9clicked = false;
   } else {
      console.log("menu7_else");
      //     scene.animPlayInTime("Cover",0,1);
      scene.instanceSet("Cover","visible",false);
      scene.clearRefine();
      //    timeouts.push(setTimeout(function(){ 
      scene.gotoPosInTime(-0.7715167303121322,0.8455580327856126,-1.194294717652605,0.634411292428634,40,1000);
      $("#point7text .Point7Img").css("display","block");
      //	}, 100));
      //    timeouts.push(setTimeout(function(){ 
      //        scene.animPlayInTime("Cover",1,1000,function(){
      //            scene.instanceSet("Cover","visible",false); 
      //            scene.clearRefine();
      //        });
      //	}, 2500));
      timeouts.push(setTimeout(function () {
         scene.instanceSet("Cover","visible",false);
         $("#point7text").fadeIn(400);
         translateIn(7);
      },2600));
      timeouts.push(setTimeout(function () {
         animComplete();
         if (autoplayAnim) {
            animCompeteAuto();
         }
      },3500));
      menu9clicked = true;
      menu7clicked = true;
   }
}

function menu8Click() {
   console.log("menu_8_clicked");
   hideAllObjects();
   objectHide();
   animStoped = false;
   //    scene.clearRefine();
   //     scene._nav._panMax =  [38, 17];
   //    scene._nav._panMin =  [-42, -7];
   $("#onloadCopy").css("opacity","0").fadeOut(400);
   //    $("#cpHeading").text("Interior – 4 Processor, 48 DIMM");
   $("#cpHeading").html("ThinkSystem SD650-N V2 Nodes and DW612 Enclosure");
   $("#menu").parents().prev(".menuitems").addClass("active")
   $("#menu8").removeClass("disabled");
   $("#menu8").removeClass('active');
   $(".greyOutBox").removeClass('redOutBox');
   $("#menu8 .greyOutBox").addClass('redOutBox');
   $("#point11text").css('display','none');
   scene.groupApplyState('Enclosure_ON');
   scene.groupApplyState('GPU_LIGHT_OFF');
   scene.groupApplyState('Nvidia_OFF');
   scene.groupApplyState('SD650_OFF');
   scene.groupApplyState('Rack_OFF');
   scene.groupApplyState('Enclosure_PIPE_OFF');
   scene.groupApplyState('Rear_Enclosure_Pipe_Off');
   scene.gotoPosInTime(2.753849744066291,0.106283185307179587,-8.208018074793337,-3.1077302798758961,270.89840544751495,1000);
   //        timeouts.push(setTimeout(function () {
   //            scene.instanceSet("Cover", "visible", false);
   //            scene.clearRefine();
   //        }, 1000));
   timeouts.push(setTimeout(function () {
      timeouts.push(setTimeout(function () {
         $("#point8text").fadeIn(400);
         autoRotateCall()
         translateIn(8);
      },200));
      animComplete();
      if (autoplayAnim) {
         animCompeteAuto();
      }
      scene.gotoPosInTime(2.753849744066291,0.106283185307179587,-8.208018074793337,-3.1077302798758961,270.89840544751495,1000);
      //        $("#pont10Img1").fadeIn(1000);
      //        timeouts.push(setTimeout(function () {
      //            $("#pont10Img1").fadeOut();
      //            $("#pont10Img2").fadeIn(1000);
      //            timeouts.push(setTimeout(function () {
      //                $("#pont10Img2").fadeOut();
      //                $("#pont10Img1").fadeIn(1000);
      //            }, 2000));
      //        }, 4000));
   },1000));
   //        timeouts.push(setTimeout(function () {
   //            $("#point8text").fadeIn(400);
   //           // $("#point8Div").fadeIn(500);
   //            timeouts.push(setTimeout(function () {
   //                translateIn(8);
   //            }, 200));
   //           
   //             timeouts.push(setTimeout(function () {
   //            animComplete();
   //            if (autoplayAnim) {
   //                animCompeteAuto();
   //            }
   //        }, 4500));
   // animComplete();
   ////            if (autoplayAnim) {
   ////                animCompeteAuto();
   ////            }
   //        }, 3000));
   //        menu9clicked = true;
   menu9clicked = true;
   menu7clicked = true;
   scene.clearRefine();
}

function menu9Click() {
   console.log("menu9Clicked");
   hideAllObjects();
   objectHide();
   animStoped = false;
   $("#onloadCopy").css("opacity","0").fadeOut(400);
   autoRotateState = false;
   $("#cpHeading").text("ThinkSystem SD650-N V2 Nodes and DW612 Enclosure");
   $("#menu").parents().prev(".menuitems").addClass("active")
   $("#menu9").removeClass("disabled");
   $("#menu9").removeClass('active');
   $(".greyOutBox").removeClass('redOutBox');
   $("#menu9 .greyOutBox").addClass('redOutBox');
   scene.groupApplyState('Enclosure_ON');
   scene.groupApplyState('GPU_LIGHT_OFF');
   scene.groupApplyState('Nvidia_OFF');
   scene.groupApplyState('SD650_OFF');
   scene.groupApplyState('Rack_OFF');
   scene.groupApplyState('Enclosure_PIPE_OFF');
   scene.groupApplyState('Rear_Enclosure_Pipe_Off');
   timeouts.push(setTimeout(function () {
      $("#point9text").show(500);
      timeouts.push(setTimeout(function () {
         translateIn(9);
         timeouts.push(setTimeout(function () {
            autoRotateCall();
         },8000));
      },200));
      animComplete();
      if (autoplayAnim) {
         autoRotateCall()
         animCompeteAuto();
      }
   },1000));
   scene.gotoPosInTime(0.0520,0.000,-10.42365327930184,1.905543042234627,235,2000);
   scene.clearRefine();
   menu9Clicked = true;
}

function menu10Click() {
   console.log("menu10Clicked");
   hideAllObjects();
   objectHide();
   animStoped = false;
   autoRotateState = false;
   $("#cpHeading").text("ThinkSystem SD650-N V2 Nodes and DW612 Enclosure");
   $("#onloadCopy").css("display","none");
   $("#dummy-canvas").css("pointer-events","all");
   $("#rightAnim").css("display","none");
   scene.instanceSet("External_Hotspot","visible",false);
   scene.instanceSet("Internal_Hotspot","visible",false);
   scene.groupApplyState('Enclosure_ON');
   scene.groupApplyState('GPU_LIGHT_OFF');
   scene.groupApplyState('Nvidia_OFF');
   scene.groupApplyState('SD650_OFF');
   scene.groupApplyState('Rack_OFF');
   scene.groupApplyState('Enclosure_PIPE_OFF');
   scene.groupApplyState('Rear_Enclosure_Pipe_Off');
   scene.gotoPosInTime(0.5133438742868827,0.10474925986923128,-45.42365327930184,-1.905543042234627,310,2000);
   timeouts.push(setTimeout(function () {
      timeouts.push(setTimeout(function () {
         $("#point10text").fadeIn(400);
         translateIn(10);
         timeouts.push(setTimeout(function () {
            autoRotateCall();
         },5000));
      },200));
      animComplete();
      if (autoplayAnim) {
         animCompeteAuto();
      }
      scene.gotoPosInTime(0.5133438742868827,0.10474925986923128,-45.42365327930184,-1.905543042234627,310,2000);
      //        $("#pont10Img1").fadeIn(1000);
      //        timeouts.push(setTimeout(function () {
      //            $("#pont10Img1").fadeOut();
      //            $("#pont10Img2").fadeIn(1000);
      //            timeouts.push(setTimeout(function () {
      //                $("#pont10Img2").fadeOut();
      //                $("#pont10Img1").fadeIn(1000);
      //            }, 2000));
      //        }, 4000));
   },1000));
   scene.gotoPosInTime(0.5133438742868827,0.10474925986923128,-45.42365327930184,-1.905543042234627,310,2000);
   scene.clearRefine();
   // menu9clicked = false;
   menu10clicked = true;
}

function menu11Fadeout() {
   $("#point11image2").removeClass("point11image2_animate");
   $("#point11image3").removeClass("point11image3_animate");
   $("#point11image4").removeClass("point11image4_animate");
   $("#point11image5").removeClass("point11image5_animate");
   $("#point11image2").removeClass("point11image2_animateRemove");
   $("#point11image3").removeClass("point11image3_animateRemove");
   $("#point11image4").removeClass("point11image4_animateRemove");
   $("#point11image5").removeClass("point11image5_animateRemove");
   $("#point11image2 img").fadeOut(1);
   $("#point11text5").fadeOut(1);
   $("#point11text6").fadeOut(1);
   $("#point11image3 img").fadeOut(1);
   $("#point11text10").fadeOut(1);
   $("#point11text11").fadeOut(1);
   $("#point11image4 img").fadeOut(1);
   $("#point11text15").fadeOut(1);
   $("#point11image5 img").fadeOut(1);
   $("#point11text12").fadeOut(1);
   $("#point11text1").fadeIn(500);
   $("#point11image1 img").fadeIn(500);
   $("#point11image1_1 img").fadeIn(500);
   $("#point11image1_2 img").fadeIn(500);
   $("#point11image1_3 img").fadeIn(500);
   $("#point11image1_4 img").fadeIn(500);
}

function menu11Click() {
   console.log("menu11Clicked");

   objectHide();
   hideAllObjects();
   hideCallouts();
   animStoped = false;
   menu11Fadeout();
   autoRotateState = false;
   $("#point20text").css('display','none');
   $("#cpHeading").text("Lenovo Data Center Services");
   $("#onloadCopy").css("display","none");
   scene.groupApplyState('GPU_LIGHT_OFF');
   scene.groupApplyState('SD650_OFF');
   scene.groupApplyState('Enclosure_OFF');
   scene.groupApplyState('Nvidia_OFF');
   scene.groupApplyState('Rack_OFF');
   scene.clearRefine();
   scene.instanceSet("EXTRNAL","visible",false);
   scene.instanceSet("INTERNAL","visible",false);
   scene.instanceSet("GP","visible",false);
   scene.instanceSet("SR850_Remote","visible",false);
   scene.animPlayInTime("Ex_Tray_Holder",0,0);
   scene.animPlayInTime("Ex_Tray_Holder",0,0);
   scene.instanceSet("SR850_V02_WITH_INTERNAL","visible",false);
   scene.instanceSet("External_Hotspot","visible",false);
   $("#dummy-canvas").css("pointer-events","none");
   $("#rightAnim").css("display","none");
   $("#point11text").css('display','block');

   scene.instanceSet("External_Hotspot","visible",false);
   scene.instanceSet("Internal_Hotspot","visible",false);
   scene.groupApplyState('back_new_off');
   scene.clearRefine();
   timeouts.push(setTimeout(function () {
      console.log("in_timeout_1");
      $("#point11text").css('display','block');
      $("#point11text2").fadeIn(10);
      $("#point11text3").fadeIn(10);
      $("#point11text4").fadeIn(10);
      $("#point11text7").fadeIn(10);
   },1000));
   //    slide2
   if (menu11Clicked) {
      point11anim1();
   } else {
      timeouts.push(setTimeout(function () {
         point11anim1();
      },3000));
   }
   //    slide 3 start
   timeouts.push(setTimeout(function () {
      point11anim2();
   },10000));
   // slide 4 start   
   timeouts.push(setTimeout(function () {
      point11anim3();
   },17000));
   // slide 5 start   
   timeouts.push(setTimeout(function () {
      point11anim4();
   },24000));
   timeouts.push(setTimeout(function () {
      animComplete();
   },1000));
   timeouts.push(setTimeout(function () {
      if (autoplayAnim) {
         animCompeteAuto();
      } else {
         animComplete();
      }
   },30000));
   scene.clearRefine();
   menu9clicked = false;
   menu7clicked = false;
   menu11Clicked = true;
}

function point11anim1() {
   timeouts.push(setTimeout(function () {
      $("#point11image2").addClass("point11image2_animate");
      $("#point11image2 img").fadeIn(1000);
      $("#point11text2").fadeOut(500);
      $("#point11image1_1 img").fadeOut(800);
   },1000));
   timeouts.push(setTimeout(function () {
      $("#point11text5").fadeIn(500);
      $("#point11text6").fadeIn(500);
   },2000));
   timeouts.push(setTimeout(function () {
      $("#point11image2").addClass("point11image2_animateRemove");
      $("#point11text5").fadeOut(1000);
      $("#point11text6").fadeOut(1000);
   },5000));
   timeouts.push(setTimeout(function () {
      $("#point11text2").fadeIn(500);
      $("#point11image1_1 img").fadeIn(500);
      $("#point11image2 img").fadeOut(500);
   },7000));
}

function point11anim2() {
   timeouts.push(setTimeout(function () {
      $("#point11image3").addClass("point11image3_animate");
      $("#point11image3 img").fadeIn(1000);
      $("#point11text3").fadeOut(500);
      $("#point11image1_2 img").fadeOut(800);
   },1000));
   timeouts.push(setTimeout(function () {
      $("#point11text10").fadeIn(500);
      $("#point11text11").fadeIn(500);
   },2000));
   timeouts.push(setTimeout(function () {
      $("#point11image3").addClass("point11image3_animateRemove");
      $("#point11text10").fadeOut(500);
      $("#point11text11").fadeOut(500);
   },5500));
   timeouts.push(setTimeout(function () {
      $("#point11text3").fadeIn(500);
      $("#point11image1_2 img").fadeIn(500);
      $("#point11image3 img").fadeOut(500);
   },7500));
}

function point11anim3() {
   timeouts.push(setTimeout(function () {
      $("#point11image4").addClass("point11image4_animate");
      $("#point11image4 img").fadeIn(1000);
      $("#point11text4").fadeOut(500);
      $("#point11image1_3 img").fadeOut(800);
   },1000));
   timeouts.push(setTimeout(function () {
      $("#point11text15").fadeIn(500);
   },2000));
   timeouts.push(setTimeout(function () {
      $("#point11image4").addClass("point11image4_animateRemove");
      $("#point11text15").fadeOut(500);
   },5500));
   timeouts.push(setTimeout(function () {
      $("#point11image4 img").fadeOut(500);
      $("#point11image1_3 img").fadeIn(100);
      $("#point11text4").fadeIn(100);
   },7500));
}

function point11anim4() {
   timeouts.push(setTimeout(function () {
      $("#point11image5").addClass("point11image5_animate");
      $("#point11image5 img").fadeIn(1000);
      $("#point11text7").fadeOut(500);
      $("#point11image1_4 img").fadeOut(800);
   },1000));
   timeouts.push(setTimeout(function () {
      $("#point11text12").fadeIn(500);
   },2000));
   timeouts.push(setTimeout(function () {
      $("#point11image5").addClass("point11image5_animateRemove");
      $("#point11text12").fadeOut(500);
   },5500));
   timeouts.push(setTimeout(function () {
      $("#point11image5 img").fadeOut(500);
      $("#point11image1_4 img").fadeIn(100);
      $("#point11text7").fadeIn(100);
   },7500));
}

function menu12Click() {
   autoRotateState = false;
   clearTimeout(myVar);
   console.log("menu12_click");
   scene.instanceSet("Ex_Tray_center","visible",true);
   scene.clearRefine();
   scene.gotoPosInTime(2.753849744066291,0.106283185307179587,-8.208018074793337,-7.1077302798758961,270.89840544751495,1000);
   $("#cpHeading").html("ThinkSystem SD650-N V2 Nodes and DW612 Enclosure");
   $("#onloadCopy").css('display','none');
   $("#menu").parents().prev(".menuitems").addClass("active")
   $("#menu12").removeClass("disabled");
   $("#menu12").removeClass('active');
   $(".greyOutBox").removeClass('redOutBox');
   $("#menu12 .greyOutBox").addClass('redOutBox');
   scene.animPlayInTime("Trey_Handle",0,1);
   scene.instanceSet("Ex_Tray","visible",false);
   scene.instanceSet("Trey_Handle","visible",false);
   scene.instanceSet("body","visible",true);
   scene.instanceSet("Ex_Tray","visible",false);
   scene.instanceSet("Trey_Handle","visible",false);
   scene.instanceSet("EXTRNAL","visible",true);
   scene.instanceSet("INTERNAL","visible",true);
   scene.instanceSet("GP","visible",true);
   scene.instanceSet("SR850_V02_WITH_INTERNAL","visible",true);
   scene.instanceSet("External_Hotspot","visible",true);
   scene.instanceSet("Internal_Hotspot","visible",true);
   scene.instanceSet("SR850_Remote","visible",false);
   scene.animPlayInTime("Ex_Tray_Holder",0,0);
   scene.animPlayInTime("Ex_Tray_Holder",0,0);
   scene.groupApplyState('Enclosure_ON');
   scene.groupApplyState('GPU_LIGHT_OFF');
   scene.groupApplyState('Nvidia_OFF');
   scene.groupApplyState('SD650_OFF');
   scene.groupApplyState('Rack_OFF');
   scene.groupApplyState('Enclosure_PIPE_OFF');
   scene.groupApplyState('Rear_Enclosure_Pipe_On');
   scene.clearRefine();
   if (menu9clicked) {
      console.log("menu12_if");
      scene.instanceSet("Cover","visible",false);
      scene.clearRefine();
      scene.animPlayInTime("Trey_Handle",0,1);
      scene.animPlayInTime("Ex_Tray",0,1);
      scene.animPlayInTime("Ex_Tray_center",0,1);
      scene.instanceSet("SR850_Remote","visible",false);
      scene.instanceSet("SR850_V02_WITH_INTERNAL","visible",true);
      scene.instanceSet("External_Hotspot","visible",false);
      scene.instanceSet("Internal_Hotspot","visible",false);
      timeouts.push(setTimeout(function () {
         scene.gotoPosInTime(2.753849744066291,0.106283185307179587,-8.208018074793337,-7.1077302798758961,270.89840544751495,1000);
      },100));
      //   timeouts.push(setTimeout(function(){ 
      //       scene.animPlayInTime("Cover",1,2000);
      //	}, 1500));
      timeouts.push(setTimeout(function () {
         scene.instanceSet("Cover","visible",false);
         scene.clearRefine();
         $("#point12text").fadeIn(400);
         translateIn(12);
      },2000));
      timeouts.push(setTimeout(function () {
         animComplete();
         if (autoplayAnim) {
            animCompeteAuto();
         }
      },3500));
      scene.clearRefine();
      menu7clicked = true;
      menu9clicked = false;
   } else {
      console.log("menu12_else");
      //     scene.animPlayInTime("Cover",0,1);
      //    timeouts.push(setTimeout(function(){ 
      scene.instanceSet("SR850_V02_WITH_INTERNAL","visible",true);
      scene.instanceSet("Cover","visible",true);
      scene.instanceSet("External_Hotspot","visible",false);
      scene.instanceSet("Internal_Hotspot","visible",false);
      scene.instanceSet("SR850_Remote","visible",false);
      scene.clearRefine();
      scene.clearRefine();
      scene.gotoPosInTime(2.753849744066291,0.106283185307179587,-8.208018074793337,-7.1077302798758961,270.89840544751495,1000);
      //	}, 100));
      timeouts.push(setTimeout(function () {
         scene.animPlayInTime("Cover",1,1000,function () {
            scene.instanceSet("Cover","visible",false);
            scene.clearRefine();
         });
      },2000));
      timeouts.push(setTimeout(function () {
         scene.instanceSet("Cover","visible",false);
         $("#point12text").fadeIn(400);
         translateIn(12);
         scene.clearRefine();
      },3600));
      timeouts.push(setTimeout(function () {
         animComplete();
         if (autoplayAnim) {
            animCompeteAuto();
         }
      },3500));
      menu9clicked = true;
      menu7clicked = true;
   }
}

function slideshow() {


   // console.log("time in set ",Date.now);
   timeouts.push(setTimeout(function () {
      $(".point13text2").fadeOut();
      $(".point13text3").fadeIn(1000);
   },4000));

   timeouts.push(setTimeout(function () {
      $(".point13text3").fadeOut();
      $(".point13text4").fadeIn(1000);
   },8000));

   timeouts.push(setTimeout(function () {
      $(".point13text4").fadeOut();
      $(".point13text5").fadeIn(1000);
   },12000));

   timeouts.push(setTimeout(function () {
      $(".point13text5").fadeOut();
      $(".point13text2").fadeIn(1000);
   },16000));
   //    timeouts.push(setTimeout(function () {
   //        $(".point13text2").fadeOut();
   //        $(".point13text3").fadeIn(1000);
   //    }, 10000));

}

function menu13Click() {
   console.log("menu13Clicked");

   objectHide();
   hideAllObjects();
   hideCallouts();
   //animStoped = false;
   menu13clicked = true;
   //    scene._nav._panMax =  [38, 17];
   //    scene._nav._panMin =  [-42, -7];
   $("#onloadCopy").css('display','none');
   $("#cpHeading").text("Lenovo Intelligent Computing Orchestration (LiCO) Management");
   $("#point20text").css('display','none');
   scene.groupApplyState('back_new_off');
   $("#point13text").fadeIn(400);
   $("#point14text").hide();
   $(".point13text3").fadeOut();
   $(".point13text4").fadeOut();
   $(".point13text5").fadeOut();
   console.log("time ",Date.now);
   translateIn(13);
   slideshow();

   setInterval(function () {
      slideshow();
   },18000);


   timeouts.push(setTimeout(function () {
      animComplete();
   },10000));


   if (autoplayAnim) {
      animCompeteAuto();
   }
   scene.clearRefine();
   menu9clicked = false;
   menu7clicked = false;
}

function menu14Click() {
   console.log("menu14Clicked");
   hideAllObjects();
   objectHide();
   hideCallouts();
   animStoped = false;
   //    scene._nav._panMax =  [38, 17];
   //    scene._nav._panMin =  [-42, -7];
   $("#onloadCopy").css('display','none');
   menu14clicked = true;
   $("#point13img1, #point13img2, #point13img3, #point13img4").css('display','none');
   $("#cpHeading").text("From Exascale to Everyscale™");

   scene.groupApplyState('4x_sxw');
   scene.groupApplyState('back_new_off');
   scene.gotoPosInTime(-0.199846,0.045921,-4.80196,5.55286,210.003,2000,function () {
      $("#point14text").fadeIn(400);
      $("#point20text").css('display','none');
   });


   timeouts.push(setTimeout(function () {
      animComplete();
   },10000));
   timeouts.push(setTimeout(function () {
      autoRotateCall();
   },3000));
   if (autoplayAnim) {
      animCompeteAuto();
   }
   scene.clearRefine();
   //scene.clearRefine();
   menu9clicked = false;
   menu7clicked = false;
}

function menu15Click() {
   console.log("menu15Click");
   hideAllObjects();
   objectHide();
   hideCallouts();
   scene._nav._navMaxDolly = 160.0;
   // scene._nav._panMax =  [55, 50];
   // scene._nav._panMin =  [-55, -70];
   animStoped = false;
   $("#cpHeading").text("NVIDIA HGX-A40 4-GPU");
   // $("#point4text").css('display', 'block');
   $("#onloadCopy").css('display','none');
   $("#menu3").addClass("active");
   $("#menu15").removeClass("disabled");
   $("#menu15").removeClass('active');
   $(".greyOutBox").removeClass('redOutBox');
   $("#menu15 .greyOutBox").addClass('redOutBox');

   scene.groupApplyState('4x_sxw');
   scene.groupApplyState('back_new_off');
   scene.groupApplyState('4x_sxw_internal');
   scene.groupApplyState('top_open');
   scene.groupApplyState('Cooling_ON');
   scene.groupApplyState('gpu_on');
   scene.groupApplyState('GPU_SHOW_2_OFF');
   scene.groupApplyState('back_new_off');

   //	scene.gotoPosInTime(0.0249463333333326, 0.701297807056434, -15, 0, 220.882172, 1000);
   // scene.gotoPosInTime(0.0049463333333326, 1.051297807056434, -8, -34, 135.882172, 1000);
   scene.gotoPosInTime(0.0049463333333326,1.051297807056434,-8,-30,145.882172,1000);
   timeouts.push(setTimeout(function () {
      scene.animPlayInTime("Top_Cover_Animation",1,1000);
      scene.instanceSet("Cover","visible",true);
      scene.clearRefine();
      translateIn(4);
   },200));
   timeouts.push(setTimeout(function () {
      $("#point15text").fadeIn(400);
      animComplete();

   },1000));
   timeouts.push(setTimeout(function () {
      if (autoplayAnim) {
         animCompeteAuto();
      }

   },3300));
   menu9clicked = false;
   menu7clicked = false;
   scene.clearRefine();
}

function menu16Click() {
   console.log("menu16Click");
   hideAllObjects();
   objectHide();
   animStoped = false;
   scene._nav._navMaxDolly = 310.0;

   $("#cpHeading").text("4x NVIDIA A40 GPU / 8x NVMe Drive Configuration ");
   // $("#point4text").css('display', 'block');
   $("#onloadCopy").css('display','none');
   $("#menu3").addClass("active");
   $("#menu16").removeClass("disabled");
   $("#menu16").removeClass('active');
   $(".greyOutBox").removeClass('redOutBox');
   $("#menu16 .greyOutBox").addClass('redOutBox');
   scene.groupApplyState('4x_sxw');

   scene.groupApplyState('4x_sxw_internal');
   scene.groupApplyState('top_open');
   scene.groupApplyState('SXM_NVLink_GPU_Card_OFF');
   scene.groupApplyState('back_new_off');
   scene.gotoPosInTime(1.5708339999999996,1.5079644737231006,-14,5,280.882172,1000,function () {
      scene.groupApplyState('top_open');
      $("#point16text").css('display','block');
      $("#point17text").css('display','none');
      $("#point18text").css('display','none');
      $("#point20text").css('display','none');
      $("#point23text").css('display','none');
      $("#point24text").css('display','none');
      $("#point26text").css('display','none');
      $("#point29text").css('display','none');
      $("#point30text").css('display','none');
      $("#hotspot1").css('display','block');
      $("#hotspot2").css('display','block');
      $("#hotspot3").css('display','block');
      $("#hotspot4").css('display','block');
      $("#hotspot5").css('display','block');
      $("#hotspot533").css('display','block');
   });
   timeouts.push(setTimeout(function () {
      $("#point16text").fadeIn(400);
      translateIn(4);
   },1000));
   timeouts.push(setTimeout(function () {
      animComplete();
      if (autoplayAnim) animCompeteAuto();
   },4000));
   menu9clicked = false;
   menu7clicked = false;
   scene.clearRefine();
}

function menu17Click() {
   console.log("menu17Click");
   hideAllObjects();
   objectHide();
   animStoped = false;
   scene._nav._navMaxDolly = 220.0;
   //    scene._nav._panMax = [50, 17];
   //    scene._nav._panMin = [-42, -7];
   //    scene._nav._navMinDolly = -100.0;

   $("#cpHeading").text("4x NVIDIA A40 GPU / 8x NVMe Drive Configuration ");
   // $("#point4text").css('display', 'block');
   $("#onloadCopy").css('display','none');
   $("#menu3").addClass("active");
   $("#menu17").removeClass("disabled");
   $("#menu17").removeClass('active');
   $(".greyOutBox").removeClass('redOutBox');
   $("#menu17 .greyOutBox").addClass('redOutBox');
   scene.groupApplyState('4x_sxw');
   scene.groupApplyState('back_new_off');
   scene.gotoPosInTime(0.000005999999999950489,0.000005000000000032756,-7,8,180.882172,1000,function () {
      $("#point16text").css('display','none');
      $("#point17text").css('display','block');
      $("#point18text").css('display','none');
      $("#point20text").css('display','none');
      $("#point23text").css('display','none');
      $("#point24text").css('display','none');
      $("#point26text").css('display','none');
      $("#point29text").css('display','none');
      $("#point30text").css('display','none');
      $("#hotspot511").css('display','block');
   });
   timeouts.push(setTimeout(function () {
      $("#point17text").fadeIn(400);
      translateIn(4);
   },1000));
   timeouts.push(setTimeout(function () {
      animComplete();
      if (autoplayAnim) animCompeteAuto();
   },4000));
   menu9clicked = false;
   menu7clicked = false;
   scene.clearRefine();
}

function menu18Click() {
   console.log("menu18Click");
   hideAllObjects();
   objectHide();
   animStoped = false;
   scene._nav._navMaxDolly = 220.0;
   //    scene._nav._panMax = [50, 17];
   //    scene._nav._panMin = [-42, -7];
   //    scene._nav._navMinDolly = -100.0;

   $("#cpHeading").text("4x NVIDIA A40 GPU / 8x NVMe Drive Configuration");
   $("#onloadCopy").css('display','none');
   $("#menu3").addClass("active");
   $("#menu18").removeClass("disabled");
   $("#menu18").removeClass('active');
   $(".greyOutBox").removeClass('redOutBox');
   $("#menu18 .greyOutBox").addClass('redOutBox');
   scene.groupApplyState('4x_sxw');
   scene.groupApplyState('back_new_off');
   scene.gotoPosInTime(-3.1415723071795862,0.000012,-7,8,180.882172,1000,function () {
      $("#point16text").css('display','none');
      $("#point17text").css('display','none');
      $("#point18text").css('display','block');
      $("#point20text").css('display','none');
      $("#point23text").css('display','none');
      $("#point24text").css('display','none');
      $("#point26text").css('display','none');
      $("#point29text").css('display','none');
      $("#point30text").css('display','none');
   });
   timeouts.push(setTimeout(function () {
      $("#point18text").fadeIn(400);
      translateIn(4);
   },1000));
   timeouts.push(setTimeout(function () {
      animComplete();
      if (autoplayAnim) animCompeteAuto();
   },4000));
   menu9clicked = false;
   menu7clicked = false;
   scene.clearRefine();
}

function menu19Click() {
   console.log("menu19Click");
   hideAllObjects();
   objectHide();
   hideCallouts();
   animStoped = false;
   //    scene._nav._panMax = [50, 17];
   //    scene._nav._panMin = [-42, -7];
   //    scene._nav._navMinDolly = -100.0;

   $("#cpHeading").text("8x NVIDIA DW PCIe GPU / 6x EDSFF Drive Configuration");
   // $("#point4text").css('display', 'block');
   $("#onloadCopy").css('display','none');
   $("#menu19").addClass("active");
   $(".greyOutBox").removeClass('redOutBox');
   $("#menu19 .greyOutBox").addClass('redOutBox');

   scene.groupApplyState('8x_dw');
   scene.groupApplyState('back_old_off');
   scene.groupApplyState('back_new_on');
   // back_new_on

   scene.gotoPosInTime(0.309846,0.123921,-13.80196,8.55286,190.003,1000,function () {
      $("#point20text").fadeIn(200);
   });
   timeouts.push(setTimeout(function () {

      //$("#point20text").css('display', 'block');
      //$("#point20headingText").css('display', 'block');

      translateIn(4);
   },1000));
   timeouts.push(setTimeout(function () {
      animComplete();
      if (autoplayAnim) animCompeteAuto();
      autoRotateCall();
   },5000));
   menu9clicked = false;
   menu7clicked = false;
   scene.clearRefine();
}

function menu20Click() {
   console.log("menu20Click");
   hideAllObjects();
   objectHide();
   animStoped = false;
   scene._nav._navMaxDolly = 310.0;
   //    scene._nav._panMax = [50, 17];
   //    scene._nav._panMin = [-42, -7];
   //    scene._nav._navMinDolly = -100.0;

   $("#cpHeading").text("8x NVIDIA DW PCIe GPU / 6x EDSFF Drive Configuration");
   // $("#point4text").css('display', 'block');
   $("#onloadCopy").css('display','none');
   $("#menu19").addClass("active");
   $("#menu20").removeClass("disabled");
   $("#menu20").removeClass('active');
   $(".greyOutBox").removeClass('redOutBox');
   $("#menu20 .greyOutBox").addClass('redOutBox');
   scene.groupApplyState('8x_dw');
   scene.groupApplyState('8x_DW_PCle_GPU_Card_OFF');
   scene.groupApplyState('back_old_off');
   scene.groupApplyState('back_new_on');

   scene.gotoPosInTime(0.9180255406588592,0.7762426616933429,-19,6,300.882172,1000,function () {
      scene.groupApplyState('top_open');
      $("#point16text").css('display','none');
      $("#point17text").css('display','none');
      $("#point18text").css('display','none');
      $(".point20headingText").css('display','none');
      $("#point23text").css('display','none');
      $("#point24text").css('display','none');
      $("#point26text").css('display','none');
      $("#point29text").css('display','none');
      $("#point30text").css('display','none');
      $("#hotspot19").css('display','block');
      $("#hotspot20").css('display','block');
      $("#hotspot21").css('display','block');
      $("#hotspot22").css('display','block');
      $("#hotspot23").css('display','block');
      $("#hotspot24").css('display','block');
   });
   timeouts.push(setTimeout(function () {
      $("#point20text").fadeIn(400);
      translateIn(4);
   },1000));
   timeouts.push(setTimeout(function () {
      console.log("menu4timeout5");
      animComplete();
      if (autoplayAnim) {
         animCompeteAuto();
      }
   },4000));
   menu9clicked = false;
   menu7clicked = false;
   scene.clearRefine();
}
function menu34Click() {
   console.log("menu34Click");
   hideAllObjects();
   objectHide();
   animStoped = false;
   scene._nav._navMaxDolly = 330.0;
   //    scene._nav._panMax = [50, 17];
   //    scene._nav._panMin = [-42, -7];
   //    scene._nav._navMinDolly = -100.0;

   $("#cpHeading").text("Lenovo EveryScale OVX Solution for NVIDIA Omniverse ");
   // $("#point34text").css('display', 'block');
   $("#onloadCopy").css('display','none');
   $("#menu34").addClass("active");
   //	$("#menu20").removeClass("disabled");
   //	$("#menu20").removeClass('active');
   //	$(".greyOutBox").removeClass('redOutBox');
   //	$("#menu20 .greyOutBox").addClass('redOutBox');
   scene.groupApplyState('8x_dw');
   scene.groupApplyState('8x_DW_PCle_GPU_Card_OFF');
   scene.groupApplyState('back_old_off');
   scene.groupApplyState('back_new_on');
   scene.gotoPosInTime(0.9180255406588592,0.7762426616933429,-12,6,300.882172,1000,function () {
      scene.groupApplyState('top_open');
      $("#point16text").css('display','none');
      $("#point17text").css('display','none');
      $("#point18text").css('display','none');
      $(".point20headingText").css('display','none');
      $("#point23text").css('display','none');
      $("#point24text").css('display','none');
      $("#point26text").css('display','none');
      $("#point29text").css('display','none');
      $("#point30text").css('display','none');
      $("#hotspot019").css('display','block');
      $("#hotspot020").css('display','block');
      $("#hotspot021").css('display','block');
      $("#hotspot022").css('display','block');
      $("#hotspot023").css('display','block');
      $("#hotspot024").css('display','block');
   });
   timeouts.push(setTimeout(function () {
      $("#point34text").fadeIn(400);
      translateIn(34);
   },1000));
   timeouts.push(setTimeout(function () {
      console.log("menu4timeout5");
      animComplete();
      if (autoplayAnim) {
         animCompeteAuto();
      }
   },4000));
   menu9clicked = false;
   menu7clicked = false;
   scene.clearRefine();
}


function menu21Click() {
   console.log("menu21Click");
   hideAllObjects();
   objectHide();
   hideCallouts();
   animStoped = false;
   scene._nav._navMaxDolly = 300.0;
   scene._nav._panMax = [50,17];
   scene._nav._panMin = [-42,-17];
   //    scene._nav._navMinDolly = -100.0;
   $("#cpHeading").text("8x NVIDIA DW PCIe A40 GPUs");
   // $("#point4text").css('display', 'block');
   $("#onloadCopy").css('display','none');
   $("#menu19").addClass("active");
   $("#menu21").removeClass("disabled");
   $("#menu21").removeClass('active');
   $(".greyOutBox").removeClass('redOutBox');
   $("#menu21 .greyOutBox").addClass('redOutBox');
   scene.groupApplyState('8x_dw');
   scene.groupApplyState('back_old_off');
   scene.groupApplyState('back_new_on');
   scene.groupApplyState('top_open');
   scene.gotoPosInTime(0.0012969476925042,1.0079644737231006,-13,-14,260.882172,1000,function () {
      scene.groupApplyState('top_open');
   });
   timeouts.push(setTimeout(function () {
      $("#point21text").fadeIn(400);
      translateIn(4);
   },3000));
   timeouts.push(setTimeout(function () {
      console.log("menu4timeout5");
      animComplete();
      if (autoplayAnim) {
         animCompeteAuto();
      }
   },4000));
   menu9clicked = false;
   menu7clicked = false;
   scene.clearRefine();
}

function menu22Click() {
   console.log("menu22Click");

   objectHide();
   hideAllObjects();
   hideCallouts();
   //animStoped = false;
   //    scene._nav._panMax = [50, 17];
   //    scene._nav._panMin = [-42, -7];
   //    scene._nav._navMinDolly = -100.0;
   $("#cpHeading").text("Cooling System");
   // $("#point4text").css('display', 'block');
   $("#onloadCopy").css('display','none');
   $("#menu19").addClass("active");
   $("#menu22").removeClass("disabled");
   $("#menu22").removeClass('active');
   $(".greyOutBox").removeClass('redOutBox');
   $("#menu22 .greyOutBox").addClass('redOutBox');
   scene.groupApplyState('back_old_off');
   // scene.groupApplyState('back_new_on');
   scene.groupApplyState('back_new_off');

   //    scene.groupApplyState('8x_dw');
   //    scene.groupApplyState('top_open');
   //    scene.groupApplyState('Cooling_ON');
   //	scene.gotoPosInTime(2.5330265318422494, 0.6174022842225939, -15, 11, 280.882172, 1000, function () {
   //		scene.instanceSet("Remote", "visible", true);
   //		scene.instanceSet("SR850_Remote", "visible", true);
   //		scene.instanceSet('SR850_Remote_1_polySurface10', 'visible', false);
   //		scene.clearRefine();
   //	});
   timeouts.push(setTimeout(function () {
      $('#playVideos2').css('display','block');
      playVid(vidx2);
      $("#point22text").fadeIn(400);
      $("#point20text").css('display','none')
      translateIn(4);
   },200));
   timeouts.push(setTimeout(function () {
      animComplete();
      if (autoplayAnim) {
         animCompeteAuto();
      }
   },2000));
   menu9clicked = false;
   menu7clicked = false;
   scene.clearRefine();
}

function menu23Click() {
   console.log("menu23Click");
   hideAllObjects();
   objectHide();
   animStoped = false;
   scene._nav._navMaxDolly = 220.0;
   //    scene._nav._panMax = [50, 17];
   //    scene._nav._panMin = [-42, -7];
   //    scene._nav._navMinDolly = -100.0;
   $("#cpHeading").text("8x NVIDIA PCIe A40 GPU Configuration");
   // $("#point4text").css('display', 'block');
   $("#onloadCopy").css('display','none');
   $("#menu19").addClass("active");
   $("#menu23").removeClass("disabled");
   $("#menu23").removeClass('active');
   $(".greyOutBox").removeClass('redOutBox');
   $("#menu23 .greyOutBox").addClass('redOutBox');
   scene.groupApplyState('8x_dw');
   scene.groupApplyState('back_old_off');
   scene.groupApplyState('back_new_on');
   scene.gotoPosInTime(0.000005999999999950489,0.000005000000000032756,-7,8,180.882172,1000,function () {
      $("#point16text").css('display','none');
      $("#point17text").css('display','none');
      $("#point18text").css('display','none');
      $("#point20text").css('display','none');
      $("#point23text").css('display','block');
      $("#point24text").css('display','none');
      $("#point26text").css('display','none');
      $("#point29text").css('display','none');
      $("#point30text").css('display','none');
   });
   timeouts.push(setTimeout(function () {
      $("#point23text").fadeIn(400);
      translateIn(4);
   },1000));
   timeouts.push(setTimeout(function () {
      animComplete();
      if (autoplayAnim) {
         animCompeteAuto();
      }
      autoRotateCall();
   },5000));
   menu9clicked = false;
   menu7clicked = false;
   scene.clearRefine();
}

function menu24Click() {
   console.log("menu24Click");
   hideAllObjects();
   objectHide();
   animStoped = false;
   scene._nav._navMaxDolly = 220.0;
   //    scene._nav._panMax = [50, 17];
   //    scene._nav._panMin = [-42, -7];
   //    scene._nav._navMinDolly = -100.0;

   $("#cpHeading").text("8x NVIDIA PCIe A40 GPU Configuration");
   $("#onloadCopy").css('display','none');
   $("#menu19").addClass("active");
   $("#menu24").removeClass("disabled");
   $("#menu24").removeClass('active');
   $(".greyOutBox").removeClass('redOutBox');
   $("#menu24 .greyOutBox").addClass('redOutBox');
   scene.groupApplyState('8x_dw');
   scene.groupApplyState('back_old_off');
   scene.groupApplyState('back_new_on');

   scene.gotoPosInTime(-3.1415723071795862,0.000012,-7,8,180.882172,1000,function () {
      $("#point16text").css('display','none');
      $("#point17text").css('display','none');
      $("#point18text").css('display','block');
      $("#hotspot11").css('display','block');
      $("#point20text").css('display','none');
      $("#point23text").css('display','none');
      $("#point24text").css('display','none');
      $("#point26text").css('display','none');
      $("#point29text").css('display','none');
      $("#point30text").css('display','none');

   });
   timeouts.push(setTimeout(function () {
      $("#point24text").fadeIn(400);
      translateIn(4);
   },1000));
   timeouts.push(setTimeout(function () {
      animComplete();
      if (autoplayAnim) {
         animCompeteAuto();
      }
      autoRotateCall();
   },5000));
   menu9clicked = false;
   menu7clicked = false;
   scene.clearRefine();
}

function menu25Click() {
   console.log("menu25Click");
   hideAllObjects();
   objectHide();
   hideCallouts();
   animStoped = false;
   //    scene._nav._panMax = [50, 17];
   //    scene._nav._panMin = [-42, -7];
   //    scene._nav._navMinDolly = -100.0;
   // $("#cpHeading").text("8x NVIDIA SW GPU  / 4x DW PCIe GPU Configuration");
   $("#cpHeading").text("4x NVIDIA DW A40 PCle GPU / 8x 2.5-inch NVMe Drive Configuration");
   $("#onloadCopy").css('display','none');
   $("#menu25").addClass("active");
   $(".greyOutBox").removeClass('redOutBox');
   $("#menu25 .greyOutBox").addClass('redOutBox');
   scene.groupApplyState('8x_sw');
   scene.groupApplyState('back_new_off');
   scene.gotoPosInTime(0.309846,0.123921,-13.80196,8.55286,190.003,1000);
   timeouts.push(setTimeout(function () {
      scene.animPlayInTime("Top_Cover_Animation",1,1000);
      scene.clearRefine();
      translateIn(4);
   },3000));
   timeouts.push(setTimeout(function () {
      $("#point25text").fadeIn(400);
      $("#point20text").css('display','none')
      scene.instanceSet("Top_Cover_Animation","visible",false);
      scene.clearRefine();
   },1000));
   timeouts.push(setTimeout(function () {
      animComplete();
      autoRotateCall();
      if (autoplayAnim) {
         animCompeteAuto();
      }
   },5000));
   menu9clicked = false;
   menu7clicked = false;
   scene.clearRefine();
}

function menu26Click() {
   console.log("menu26Click");
   hideAllObjects();
   objectHide();
   animStoped = false;
   scene._nav._navMaxDolly = 300.0;
   //    scene._nav._panMax = [50, 17];
   //    scene._nav._panMin = [-42, -7];
   //    scene._nav._navMinDolly = -100.0;
   $("#cpHeading").text("4x NVIDIA DW A40 PCIe GPU / 8x 2.5-inch NVMe Drive Configuration");
   // $("#point4text").css('display', 'block');
   $("#onloadCopy").css('display','none');
   //    scene.instanceSet("SR850_V02_WITH_INTERNAL", "visible", true);
   //    scene.instanceSet("SR850_Remote", "visible", false);
   $("#menu25").addClass("active")

   $("#menu26").removeClass("disabled");
   $("#menu26").removeClass('active');
   $(".greyOutBox").removeClass('redOutBox');
   $("#menu26 .greyOutBox").addClass('redOutBox');
   scene.groupApplyState('8x_sw');

   scene.groupApplyState('4x_DW_PCle_GPU_Card_OFF');
   scene.groupApplyState('back_new_off');
   scene.gotoPosInTime(0.7708339999999996,0.7079644737231006,-17,5,280.882172,1000,function () {
      $("#hotspot40 hotspot41 hotspot42 hotspot43 hotspot44").addClass("vaisbilityVisiable")
      //        $("#hotspot40 #hotspot41 #hotspot42 #hotspot43 #hotspot44").addClass("vaisbilityVisiable");
      scene.groupApplyState('top_open');
      $("#point16text").css('display','none');
      $("#point17text").css('display','none');
      $("#point18text").css('display','none');
      $("#point20text").css('display','none');
      $("#point23text").css('display','none');
      $("#point24text").css('display','none');
      $("#point26text").css('display','block');
      $("#point29text").css('display','none');
      $("#point30text").css('display','none');
      $("#hotspot40").css('display','block');
      $("#hotspot41").css('display','block');
      $("#hotspot42").css('display','block');
      $("#hotspot43").css('display','block');
      $("#hotspot44").css('display','block');
      $("#hotspot45").css('display','block');
      $("#hotspot46").css('display','block');


   });
   timeouts.push(setTimeout(function () {
      scene.animPlayInTime("Top_Cover_Animation",1,1000);
      scene.clearRefine();
      translateIn(4);
   },3000));
   timeouts.push(setTimeout(function () {
      $("#point26text").fadeIn(400);
      scene.instanceSet("Top_Cover_Animation","visible",false);
      scene.clearRefine();
   },5000));
   timeouts.push(setTimeout(function () {
      console.log("menu4timeout5");
      animComplete();
      if (autoplayAnim) {
         animCompeteAuto();
      }
   },4000));
   menu9clicked = false;
   menu7clicked = false;
   scene.clearRefine();
}

function menu27Click() {
   console.log("menu27Click");
   hideAllObjects();
   objectHide();
   hideCallouts();
   animStoped = false;
   scene._nav._navMaxDolly = 280.0;
   //    scene._nav._panMax = [50, 17];
   //    scene._nav._panMin = [-42, -7];
   //    scene._nav._navMinDolly = -100.0;
   $("#cpHeading").text("4x NVIDIA DW A40 PCIe GPU / 8x 2.5-inch NVMe Drive Configuration");
   $("#onloadCopy").css('display','none');
   $("#menu25").addClass("active")
   $("#menu27").removeClass("disabled");
   $("#menu27").removeClass('active');
   $(".greyOutBox").removeClass('redOutBox');
   $("#menu27 .greyOutBox").addClass('redOutBox');
   scene.groupApplyState('8x_sw');
   scene.groupApplyState('back_new_off');
   scene.gotoPosInTime(0.2708339999999996,0.4079644737231006,-17,7,230.882172,1000,function () {
      scene.groupApplyState('top_open');
   });
   timeouts.push(setTimeout(function () {
      $("#point27text").fadeIn(400);
      translateIn(4);
   },1000));
   timeouts.push(setTimeout(function () {
      animComplete();
      if (autoplayAnim) animCompeteAuto();
   },4000));
   menu9clicked = false;
   menu7clicked = false;
   scene.clearRefine();
}

function menu28Click() {
   console.log("menu28Click");

   objectHide();
   hideAllObjects();
   hideCallouts();
   animStoped = false;
   //    scene._nav._panMax = [50, 17];
   //    scene._nav._panMin = [-42, -7];
   //    scene._nav._navMinDolly = -100.0;
   $("#cpHeading").text("Cooling System");
   $("#onloadCopy").css('display','none');
   $("#menu25").addClass("active")
   $("#menu28").removeClass("disabled");
   $("#menu28").removeClass('active');
   $(".greyOutBox").removeClass('redOutBox');
   $("#menu28 .greyOutBox").addClass('redOutBox');
   //    scene.groupApplyState('8x_sw');
   //    scene.groupApplyState('top_open');
   //    scene.groupApplyState('Cooling_ON');
   //	scene.gotoPosInTime(0.8708339999999996, 0.6079644737231006, -17, 10, 270.882172, 1000, function () {
   //		scene.instanceSet("Remote", "visible", true);
   //		scene.instanceSet("SR850_Remote", "visible", true);
   //		scene.instanceSet('SR850_Remote_1_polySurface10', 'visible', false);
   //		scene.clearRefine();
   //	});
   scene.groupApplyState('back_new_off');
   timeouts.push(setTimeout(function () {
      $('#playVideos3').css('display','block');
      playVid(vidx3);
      $("#point28text").fadeIn(400);
      $("#point15text").hide(400);
      translateIn(4);
   },500));
   timeouts.push(setTimeout(function () {
      animComplete();
      if (autoplayAnim) {
         animCompeteAuto();
      }
   },4000));
   menu9clicked = false;
   menu7clicked = false;
   scene.clearRefine();
}

function menu29Click() {
   console.log("menu29Click");
   hideAllObjects();
   objectHide();
   animStoped = false;
   scene._nav._navMaxDolly = 220.0;
   //    scene._nav._panMax = [50, 17];
   //    scene._nav._panMin = [-42, -7];
   //    scene._nav._navMinDolly = -100.0;
   $("#cpHeading").text("4 DW PCIe GPU Configuration");
   // $("#point4text").css('display', 'block');
   $("#onloadCopy").css('display','none')
   $("#menu25").addClass("active");
   $("#menu29").removeClass("disabled");
   $("#menu29").removeClass('active');
   $(".greyOutBox").removeClass('redOutBox');
   $("#menu29 .greyOutBox").addClass('redOutBox');
   scene.groupApplyState('8x_sw');
   scene.groupApplyState('back_new_off');
   scene.gotoPosInTime(0.000005999999999950489,0.000005000000000032756,-7,8,180.882172,1000,function () {
      $("#point16text").css('display','none');
      $("#point17text").css('display','none');
      $("#point18text").css('display','none');
      $("#point20text").css('display','none');
      $("#point23text").css('display','none');
      $("#point24text").css('display','none');
      $("#point26text").css('display','none');
      $("#point29text").css('display','block');
      $("#point30text").css('display','none');
      $("#hotspot47").css('display','block');
      $("#hotspot48").css('display','block');
      $("#hotspot49").css('display','block');
      $("#hotspot50").css('display','block');
      $("#hotspot522").css('display','block');
   });
   timeouts.push(setTimeout(function () {
      scene.animPlayInTime("Top_Cover_Animation",1,1000);
      scene.clearRefine();
      translateIn(4);
   },3000));
   timeouts.push(setTimeout(function () {
      $("#point29text").fadeIn(400);
      scene.instanceSet("Top_Cover_Animation","visible",false);
      scene.clearRefine();
   },1000));
   timeouts.push(setTimeout(function () {
      console.log("menu4timeout5");
      animComplete();
      if (autoplayAnim) {
         animCompeteAuto();
      }
   },1000));
   timeouts.push(setTimeout(function () {
      autoRotateCall();
   },8000));
   menu9clicked = false;
   menu7clicked = false;
   scene.clearRefine();
}

function menu30Click() {
   console.log("menu30Click");
   hideAllObjects();
   objectHide();
   animStoped = false;
   scene._nav._navMaxDolly = 230.0;
   //    scene._nav._panMax = [50, 17];
   //    scene._nav._panMin = [-42, -7];
   //    scene._nav._navMinDolly = -100.0;
   $("#cpHeading").text("4 DW PCIe GPU Configuration");

   // $("#point4text").css('display', 'block');
   $("#onloadCopy").css('display','none');
   $("#menu25").addClass("active");
   $("#menu30").removeClass("disabled");
   $("#menu30").removeClass('active');
   $(".greyOutBox").removeClass('redOutBox');
   $("#menu30 .greyOutBox").addClass('redOutBox');
   scene.groupApplyState('8x_sw');
   scene.groupApplyState('back_new_off');
   scene.gotoPosInTime(-3.1415723071795862,0.000012,-7,8,180.882172,1000,function () {
      $("#point16text").css('display','none');
      $("#point17text").css('display','none');
      $("#point18text").css('display','block');
      $("#hotspot10").css('display','block');
      $("#hotspot11").css('display','block');
      $("#point20text").css('display','none');
      $("#point23text").css('display','none');
      $("#point24text").css('display','none');
      $("#point26text").css('display','none');
      $("#point29text").css('display','none');
      $("#point30text").css('display','none');
   });

   timeouts.push(setTimeout(function () {
      console.log("menu4timeout5");
      autoRotateCall();
      animComplete();
      if (autoplayAnim) {
         animCompeteAuto();
      }
   },8000));
   menu9clicked = false;
   menu7clicked = false;
   scene.clearRefine();
}

function menu31Click() {
   console.log("menu3click");
   hideAllObjects();
   objectHide();
   hideCallouts();
   animStoped = false;
   $("#onloadCopy").css('display','block');
   $("#cpHeading").text("4x NVIDIA HGX-A40 4-GPU Configuration");
   $("#transparentPatch").css("display","none");
   $("#menu3").addClass("active");
   scene.groupApplyState('4x_sxw');
   scene.groupApplyState('back_new_off');
   scene.gotoPosInTime(0.5523139438569467,0.1959522246928204,-15.517298024926861,7.3387038439301504,230.3608710178373,1000,(function () { }));
   timeouts.push(setTimeout(function () {
      $("#point20text").css('display','none');
      translateIn(3);
      //$("#point3text").css("display", "block");
      $("#point3text").fadeIn(200);
      $(".point1text1").fadeOut(200);
      //         $("#point3headingText").fadeIn(200); 
      animComplete();
      timeouts.push(setTimeout(function () {
         if (autoplayAnim) {
            animCompeteAuto();
         }

      },3300));

      scene.animPlayInTime("Top_Cover_Animation",1,1000);
      scene.clearRefine();
   },2250));
   timeouts.push(setTimeout(function () {
      scene.instanceSet("Top_Cover_Animation","visible",false);
      scene.clearRefine();
      autoRotateCall();
   },3250));
   menu9clicked = false;
   menu7clicked = false;
   scene.clearRefine();
}

function menu32Click() {
   console.log("menu19Click");
   hideAllObjects();
   objectHide();
   hideCallouts();
   animStoped = false;
   //    scene._nav._panMax = [50, 17];
   //    scene._nav._panMin = [-42, -7];
   //    scene._nav._navMinDolly = -100.0;

   $("#cpHeading").text("8x NVIDIA DW PCIe GPU / 6x EDSFF Drive Configuration");
   // $("#point4text").css('display', 'block');
   $("#onloadCopy").css('display','none');
   $("#menu19").addClass("active");
   $(".greyOutBox").removeClass('redOutBox');
   $("#menu19 .greyOutBox").addClass('redOutBox');

   scene.groupApplyState('8x_dw');

   scene.gotoPosInTime(0.309846,0.123921,-13.80196,8.55286,190.003,1000,function () {
      $("#point20text").fadeIn(200);
   });
   timeouts.push(setTimeout(function () {

      //$("#point20text").css('display', 'block');
      //$("#point20headingText").css('display', 'block');

      translateIn(4);
   },1000));
   timeouts.push(setTimeout(function () {
      animComplete();
      if (autoplayAnim) animCompeteAuto();
      autoRotateCall();
   },5000));
   menu9clicked = false;
   menu7clicked = false;
   scene.clearRefine();
}

function menu33Click() {
   console.log("menu25Click");
   hideAllObjects();
   objectHide();
   hideCallouts();
   animStoped = false;
   //    scene._nav._panMax = [50, 17];
   //    scene._nav._panMin = [-42, -7];
   //    scene._nav._navMinDolly = -100.0;
   // $("#cpHeading").text("8x NVIDIA SW GPU  / 4x DW PCIe GPU Configuration");
   $("#cpHeading").text("4x NVIDIA DW A40 PCle GPU / 8x 2.5-inch NVMe Drive Configuration");
   $("#onloadCopy").css('display','none');
   $("#menu25").addClass("active");
   $(".greyOutBox").removeClass('redOutBox');
   $("#menu25 .greyOutBox").addClass('redOutBox');
   scene.groupApplyState('8x_sw');
   scene.gotoPosInTime(0.309846,0.123921,-13.80196,8.55286,190.003,1000);
   timeouts.push(setTimeout(function () {
      scene.animPlayInTime("Top_Cover_Animation",1,1000);
      scene.clearRefine();
      translateIn(4);
   },3000));
   timeouts.push(setTimeout(function () {
      $("#point25text").fadeIn(400);
      $("#point20text").css('display','none')
      scene.instanceSet("Top_Cover_Animation","visible",false);
      scene.clearRefine();
   },1000));
   timeouts.push(setTimeout(function () {
      animComplete();
      autoRotateCall();
      if (autoplayAnim) {
         animCompeteAuto();
      }
   },5000));
   menu9clicked = false;
   menu7clicked = false;
   scene.clearRefine();
}

var timeouts = [];
// Autp Play function
function autoPlayAllAnimations() {
   console.log("Stopped",animStoped,clickEventActive);

   if (!animStoped || (!clickEventActive && !autoRotateState)) return;
   $(".menuitems").removeClass('active');
   $("#rightAnim").css("display","block");
   $(".greyOutBox").removeClass('redOutBox');
   clearInterval(autoRotateInterval);
   clearTimeout(myVar);
   clearTimeout(autoPlayInt);
   clearTimeout(startAutorot);
   $("#dummy-canvas").css("pointer-events","all");
   scene.instanceSet("SR850_V02_WITH_INTERNAL","visible",true);
   scene.groupApplyState('Only_server');
   scene.groupApplyState('Rear_1');
   scene.clearRefine();
   for (var i = 0; i < timeouts.length; i++) {
      clearTimeout(timeouts[i]);
   }
   timeouts = [];
   for (var i = 0; i < timeoutsnew.length; i++) {
      clearTimeout(timeoutsnew[i]);
   }
   timeoutsnew = [];
   firstAnim = true;
   autoplayAnim = true;
   for (var j = 1; j <= 36; j++) {
      translateOut(j);
   }
   $("#autoPlays").removeClass('playAll').off('click.playAll').addClass("pauseAll");
   $("#autoPlays .menuText").html("Stop");
   $("#pauseplayImg").css("display","none");
   $("#pauseplayImg2").css("display","block");
   $("#pauseplayImg2 img").attr("src","./images_gl/Pause.svg").css("height","13px");
   //        objectHide();
   //        reversAll();
   //        tooltipCheckbtn();
   if (currneAnim < 36) {
      console.log("currneAnim" + currneAnim);
      if (currneAnim == 14) {
         currneAnim = 6;
         AutoPlayMenus(currneAnim);
      } else if (currneAnim == 6) {
         currneAnim = 3;
         AutoPlayMenus(currneAnim);
      } else if (currneAnim == 3) {
         currneAnim = 4;
         AutoPlayMenus(currneAnim);
      }
      else if (currneAnim == 4) {
         currneAnim = 15;
         AutoPlayMenus(currneAnim);
      } else if (currneAnim == 15) {
         currneAnim = 16;
         AutoPlayMenus(currneAnim);
      } else if (currneAnim == 16) {
         currneAnim = 17;
         AutoPlayMenus(currneAnim);
      } else if (currneAnim == 17) {
         currneAnim = 18;
         AutoPlayMenus(currneAnim);
      } else if (currneAnim == 18) {
         currneAnim = 19;
         AutoPlayMenus(currneAnim);
      }
      else if (currneAnim == 19) {
         currneAnim = 20;
         AutoPlayMenus(currneAnim);
      } else if (currneAnim == 20) {
         currneAnim = 21;
         AutoPlayMenus(currneAnim);
      } else if (currneAnim == 21) {
         currneAnim = 22;
         AutoPlayMenus(currneAnim);
      } else if (currneAnim == 22) {
         currneAnim = 23;
         AutoPlayMenus(currneAnim);
      } else if (currneAnim == 23) {
         currneAnim = 24;
         AutoPlayMenus(currneAnim);
      } else if (currneAnim == 24) {
         currneAnim = 25;
         AutoPlayMenus(currneAnim);
      } else if (currneAnim == 25) {
         currneAnim = 26;
         AutoPlayMenus(currneAnim);
      } else if (currneAnim == 26) {
         currneAnim = 27;
         AutoPlayMenus(currneAnim);
      } else if (currneAnim == 27) {
         currneAnim = 28;
         AutoPlayMenus(currneAnim);
      } else if (currneAnim == 28) {
         currneAnim = 29;
         AutoPlayMenus(currneAnim);
      } else if (currneAnim == 29) {
         currneAnim = 30;
         AutoPlayMenus(currneAnim);
      }
      else if (currneAnim == 30) {
         currneAnim = 34;
         AutoPlayMenus(currneAnim);
      } else if (currneAnim == 34) {
         currneAnim = 2;
         AutoPlayMenus(currneAnim);
      } else if (currneAnim == 2) {
         currneAnim = 13;
         AutoPlayMenus(currneAnim);
      } else if (currneAnim == 13) {
         currneAnim = 11;
         AutoPlayMenus(currneAnim);
      }
      else if (currneAnim == 11) {
         //currneAnim = 3
         if (autoplayCatalog) {
            scene.stop();
            $(window.parent).unbind('resize');
            window.top.document.getElementById("mainpanel2").contentWindow.openSuperblazeAuto();
            $("#superblazeIframe",window.parent.document).css('display','none');
            window.top.document.getElementById("mainpanel2").contentWindow.superblazeClosed();
            currentAnimation = 1;
         } else {
            currneAnim = 14;
            AutoPlayMenus(currneAnim);
         }
         //                AutoPlayMenus(currneAnim);
      } else {
         currneAnim++;
         AutoPlayMenus(currneAnim);
      }
      //AutoPlayMenus(currneAnim);
   } else {
      if (autoplayCatalog) {
         console.log("autoplayCatalog in autoallplayanim");
         scene.stop();
         $(window.parent).unbind('resize');
         window.top.document.getElementById("mainpanel2").contentWindow.openSuperblazeAuto();
         $("#superblazeIframe",window.parent.document).css('display','none');
         window.top.document.getElementById("mainpanel2").contentWindow.superblazeClosed();
         currentAnimation = 1;
      } else {
         currneAnim = 14;
         AutoPlayMenus(currneAnim);
      }
   }
   console.log("play",currneAnim);
}


function autoPauseAllAnimations() {
   console.log("pause");
   clearTimeout(autoPlayInt);
   $("#autoPlays").removeClass('pauseAll').off('click.pauseAll').addClass("playAll");
   $("#autoPlays .menuText").html("Play All");
   $("#pauseplayImg2").css("display","none");
   $("#pauseplayImg").css("display","block");
   $("#pauseplayImg img").attr("src","./images_gl/Play.svg").css("height","14px");
   //    $(".menuitems").css("background-color","").css("opacity","");
   autoplayAnim = false;
   if (autoplayAnim) {
      setTimeout(function () {
         autoplayAnim = false;
         var newId = "#menu" + currneAnim;
         $("#menu" + currneAnim).addClass("active").css("background-color","#eb140a").css("opacity","1");
      },50);
   }
   //    for (var i=0; i<timeouts.length; i++) {
   //			clearTimeout(timeouts[i]);
   //     }
   //    timeouts = [];
   clearTimeout(autoPlayInt);
   setTimeout(function () {
      animComplete();
   },2000);
}
var autoPlayInt

function animCompeteAuto() {
   console.log("calleAuto");
   animStoped = true;
   autoPlayInt = setTimeout(function () {
      console.log("stopped");
      autoPlayAllAnimations();
   },9500);
}

function AutoPlayMenus(currneAnim) {
   $(".menuitems").css("background-color","").css("opacity","");
   clearInterval(autoRotateInterval);
   clearInterval(myVar);
   clearTimeout(startAutorot);
   objectHide();
   reversAll();
   prevAnimation = currneAnim;
   $("h3#menu" + currneAnim).css("background-color","#eb140a").css("opacity","1");
   for (var j = 1; j <= 36; j++) {
      translateOut(j);
   }
   //     $( "#accordion" ).accordion( "option", "disabled", true );
   switch ("menu" + currneAnim) {
      case "menu2":
         $("#accordion").accordion("option","active",false);
         menu2Click();
         break;
      case "menu3":
         $("#accordion").accordion("option","active",3);
         menu3Click();
         break;
      case "menu4":
         menu4Click();
         break;
      case "menu5":
         //	$("#accordion").accordion("option", "active", 2);
         menu5Click();
         break;
      case "menu6":
         //	$("#accordion").accordion("option", "active", 2);
         menu6Click();
         break;
      case "menu7":
         $("#accordion").accordion("option","active",false);
         menu7Click();
         break;
      case "menu8":
         //	$("#accordion").accordion("option", "active", 4);
         menu8Click();
         break;
      case "menu9":
         //$("#accordion").accordion("option", "active", 4);
         menu9Click();
         break;
      case "menu10":
         //	$("#accordion").accordion("option", "active", 4);
         menu10Click();
         break;
      case "menu11":
         //	$("#accordion").accordion("option", "active", false);
         menu11Click();
         break;
      case "menu12":
         //$("#accordion").accordion("option", "active", 4);
         menu12Click();
         break;
      case "menu13":
         $("#accordion").accordion("option","active",false);
         menu13Click();
         break;
      case "menu14":
         menu14Click();
         break;
      case "menu15":
         menu15Click();
         break;
      case "menu16":
         menu16Click();
         break;
      case "menu17":
         menu17Click();
         break;
      case "menu18":
         menu18Click();
         break;
      case "menu19":
         $("#accordion").accordion("option","active",4);
         menu19Click();
         break;
      case "menu20":
         menu20Click();
         break;
      case "menu21":
         menu21Click();
         break;
      case "menu22":
         menu22Click();
         break;
      case "menu23":
         menu23Click();
         break;
      case "menu24":
         menu24Click();
         break;
      case "menu25":
         $("#accordion").accordion("option","active",5);
         menu25Click();
         break;
      case "menu26":
         menu26Click();
         break;
      case "menu27":
         menu27Click();
         break;
      case "menu28":
         menu28Click();
         break;
      case "menu29":
         menu29Click();
         break;
      case "menu30":
         menu30Click();
         break;
      case "menu31":
         $("#accordion").accordion("option","active",3);
         //$("#menu3").trigger('click');
         menu31Click();
         break;
      case "menu32":
         $("#accordion").accordion("option","active",4);
         menu32Click();
         break;
      case "menu33":
         $("#accordion").accordion("option","active",5);
         menu33Click();
         break;
      case "menu34":
         $("#accordion").accordion("option","active",false);
         menu34Click();
         break;
      case "menu35":
         $("#accordion").accordion("option","active",false);
         menu34Click();
         break;
   }
}

function animComplete() {
   //    setTimeout(function(){
   //        $( "#accordion" ).accordion( "option", "disabled", false );
   animStoped = true;
   scene._navEnabled = true;
   //    },1500)
}

function reversAll() {
   clearInt();
   $("#Menu2text").css("display","none");
   $("#adhoc_meet_img").css("display","none");
   $("#schedule_meet_div").css("display","none");
   scene.instanceSet("SR850_V02_WITH_INTERNAL","visible",true);
   $('#playVideos1').css('display','none');
   $('#playVideos2').css('display','none');
   $('#playVideos3').css('display','none');
   stopVid();
   scene.clearRefine();
}
var imgInterval;

function clearInt() {
   clearInterval(imgInterval);
   // $("#imageContainerimg").attr('src','');
   $("#imageContainerimg").attr('src','images_gl/ring_animation/1.png');
   $("#imageContainerimg").css("display","none");
}

function close_window() {
   close();
}
document.onselectstart = function () {
   return false;
};
var btnDrag = false;

function mouseOverBtnDrag() {
   btnDrag = true;
}

function mouseOutBtnDrag() {
   setTimeout(function () {
      btnDrag = false;
   },100);
}
var updateId = 0;

function onRightClick(event) {
   ////console.log("press right");
   //mdown = true;
   //panNav = true;
   return false; //surpress theright menu 
}

function onWindowFocus() {
   updateEnabled = true;
}

function onWindowBlur() {
   updateEnabled = false;
}

function debounce(func,wait,immediate,ev) {
   var timeout;
   return function () {
      var context = this,
         args = arguments;
      var later = function () {
         timeout = null;
         if (!immediate) func.apply(context,args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later,wait);
      if (callNow) func.apply(context,args);
   };
};

function frameUpdate() {
   // objectHide();
   //$("#point14text").css('display', 'none');
   //$("#point14text1").css('display', 'none');
   window.requestAnimationFrame(frameUpdate);
   if (scene._refineCount < 64) frameUpdateForScene(scene);
   if (clickEventActive || autoRotateState) {
      $(".menuitems, #autoPlays").css("pointer-events","all");
   } else if (!clickEventActive) {
      //        console.log(">>>", clickEventActive);
      $(".menuitems, #autoPlays").css("pointer-events","none");
   }
   //       if(clickEventActive){
   //           $( "#accordion" ).accordion( "option", "disabled", false );
   //       }else{
   //                            $( "#accordion" ).accordion( "option", "disabled", true );
   //       }
   // console.log(scene._nav._navYAng+","+scene._nav._navXAng+","+scene._nav._navPan[0]+","+scene._nav._navPan[1]+","+scene._nav._navDolly);
   //   
   //     if (yPos < yEnd && mdown != true && yStarted) {
   //					autoRotateState = true;
   //					if (yPos > yEnd - 2) yPos = 0;
   //						if(new_R){
   //							autoRotateStop();
   //						}else{
   //							autoRotateRequest();
   //						}
   //     }else yStarted = false;
   //		 if(rotating[0] != 0 || rotating[1] != 0){
   //				if (rSpeed < 0){
   //					rSpeed = 0;
   //					rAcc = rAccelaration;
   //					rotating = [0,0];
   //				}
   //				rSpeed = (rSpeed < rMaxSpeed || rAcc< 0) ? rSpeed+rAcc : rSpeed;
   //				console.log(rSpeed);
   //				scene._nav.NavRotation([0,0], [rotating[0]*rSpeed, rotating[1]*rSpeed]);
   //scene.clearRefine();
}
//var sceneViewMatrix[];
function frameUpdateForScene(scene) {
   var bgotoPosInTimeUpdate = scene._nav._navgotoPosInTimeActive;
   sceneViewMatrix = scene._nav.NavCreateViewMatrix(scene._initialNavMatrix);
   scene.setViewMatrix(sceneViewMatrix);
   scene.setModelMatrix(scene._nav.NavCreateModelMatrix(scene._initialNavMatrix));
   drawn = scene.draw();
   if (drawn && AllgeoIntl) hotspotPosAsignment();
   if (bgotoPosInTimeUpdate) scene.clearRefine();
   //    hotspotPosAsignment();
   if (drawn && AllgeoIntl) Reflection();
   //    if (autoRotateState) {
   //        var numberOfAA = 2
   //        for (i = 0; i < numberOfAA; i++) {
   //            scene.draw();
   //        }
   //    }
}
/*function frameUpdateForScene(scene) {
//    var bgotoPosInTimeUpdate = scene._nav._navgotoPosInTimeActive;
//    sceneViewMatrix = scene._nav.NavCreateViewMatrix(scene._initialNavMatrix);
//    scene.setViewMatrix(sceneViewMatrix);
//    scene.setModelMatrix(scene._nav.NavCreateModelMatrix(scene._initialNavMatrix));
//    drawn = scene.draw();
//    if (drawn && AllgeoIntl) hotspotPosAsignment();
//    if (bgotoPosInTimeUpdate)
    
   var bGotoPosUpdate = scene._nav._navGotoPosActive;
   scene.setViewMatrix(scene._nav.NavCreateViewMatrix(scene._initialNavMatrix));
   scene.setModelMatrix(scene._nav.NavCreateModelMatrix(scene._initialNavMatrix));
    
   if (bGotoPosUpdate)
      scene.clearRefine();
   var drawn = scene.draw();
   if (scene2 != null) scene2.draw();
   if (drawn && AllgeoIntl) hotspotPosAsignment();
   if (drawn && AllgeoIntl) Reflection();
   if (autoRotateState) {
      var numberOfAA = 2
      for (i = 0; i < numberOfAA; i++) {
         scene.draw();
      }
   }
}*/
function getScene(ev) {
   var s = scene;
   if (scene2 != null && ev.currentTarget == canvas2) s = scene2;
   return s;
}
/*------------auto rotate functionality------------*/
var yPos = 0;
var yEnd = 300;
var yStarted = false;
var autoRotateState = false;
var yLevel = 0;
var yStep = [1];
var ySpeed = [20];
var myVar;
var autoRotateInterval;

function autoRotate() {
   //    console.log("autorotate")
   if ((navigator.userAgent.indexOf("iPhone") != -1) || ((navigator.userAgent.indexOf("Android") != -1) || (navigator.userAgent.indexOf("Mobile") != -1)) || (navigator.userAgent.indexOf('iPad') != -1) || (navigator.userAgent.indexOf('iPod') != -1)) {
      animStoped = true;
      scene._navEnabled = true;
   } else if (autoplayAnim == true) {
      animStoped = true;
      scene._navEnabled = true;
      autoRotateState = false;
   } else {
      yPos = 0;
      //            console.log('rotate', yStarted);
      if (!yStarted)
         //             autoRotateRequest();
         if (autoRotateState) {
            autoRotateInterval = setInterval(function () {
               //                  console.log('rotate');
               autoRotateRequest();
            },10);
         }
   }
}
var autoRotateInterval;

function autoRotateStop() {
   yPos = yEnd;
   autoRotateState = false;
   yStarted = false;
   clearInterval(autoRotateInterval);
   clearTimeout(autoPlayInt);
   clearTimeout(myVar);
   clearTimeout(startAutorot);
}

function autoRotateRequest(ev) {
   var s = getScene(ev);
   yStarted = true;
   yPos += 1;
   var mpos = [0.0,0.0];
   var mdelta = [0.25,0.0];
   if (s._nav.NavRotation(mpos,mdelta)) {
      //                  console.log("calle")
      scene.clearRefine();
   }
}

function autoRotateCall() {
   myVar = setTimeout(function () {
      autoRotateState = true;
      autoRotate();
      hideCallouts();
      //		$("#point3text").hide();
      //		$("#point6text").hide();
      //		$("#point7text").hide();
      $("#point8text").hide();
      $("#hotspot50").hide();
   },5000);
}
/*end*/
var hotspotPoint = true;
var hotspotOn;
var clockWise = true;
var antiClockWise = false;

function hotspotPosAsignment() {
   //    console.log("InHotspot");
   InHotspot = true;
   var viewCameraZV = [sceneViewMatrix[8],sceneViewMatrix[9],sceneViewMatrix[10]];
   if ((sceneViewMatrix[12] > -0.4 && sceneViewMatrix[12] < 0.3) && (sceneViewMatrix[14] > -18.5 && sceneViewMatrix[14] < -15.5)) {
      $("#hotspot1,#hotspot10,#hotspot11",window.document).css('visibility','visible');
   } else {
      $("#hotspot1,#hotspot10,#hotspot11,#hotspot2",window.document).css('visibility','hidden');
      //        $("#hotspot1,#hotspot10,#hotspot11,#hotspot2", window.document).css('visibility', 'hidden');
   }
   var hotspotopacityspeed = 3.0;
   var pos2Dpoint1 = [];
   var norm3Dpoint1 = scene.getObjectNormal("hotspot_4_SXM_top_01");
   var hotspotopacity1 = infinityrt_dp(norm3Dpoint1,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity1 > 0 && (hotspotOn == true)) hotspotopacity1 = 0;
   if (hotspotopacity1 < 0.0) hotspotopacity1 = 0.0;
   else if (hotspotopacity1 > 1.0) hotspotopacity1 = 1.0;
   if (hotspotopacity1 == 0) $("#hotspot1",window.document).css('visibility','hidden');
   else $("#hotspot1",window.document).css('visibility','visible');
   pos2Dpoint1 = scene.projectPoint(scene.getObjectLocation("hotspot_4_SXM_top_01",true));
   //    pos2Dpoint1 = scene.projectPoint(scene.getObjectLocation("Hotspot_Node_0Shape2-0", true));
   var pos2Dpoint2 = [];
   var norm3Dpoint2 = scene.getObjectNormal("hotspot_4_SXM_top_02");
   var hotspotopacity2 = infinityrt_dp(norm3Dpoint2,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity2 > 0 && (hotspotOn == true)) hotspotopacity2 = 0;
   if (hotspotopacity2 < 0.0) hotspotopacity2 = 0.0;
   else if (hotspotopacity2 > 1.0) hotspotopacity2 = 1.0;
   if (hotspotopacity2 == 0) $("#hotspot2",window.document).css('visibility','hidden');
   else $("#hotspot2",window.document).css('visibility','visible');
   pos2Dpoint2 = scene.projectPoint(scene.getObjectLocation("hotspot_4_SXM_top_02",true));
   var pos2Dpoint3 = [];
   var norm3Dpoint3 = scene.getObjectNormal("hotspot_4_SXM_top_03");
   var hotspotopacity3 = infinityrt_dp(norm3Dpoint3,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity3 > 0 && (hotspotOn == true)) hotspotopacity3 = 0;
   if (hotspotopacity3 < 0.0) hotspotopacity3 = 0.0;
   else if (hotspotopacity3 > 1.0) hotspotopacity3 = 1.0;
   if (hotspotopacity3 == 0) $("#hotspot3",window.document).css('visibility','hidden');
   else $("#hotspot3",window.document).css('visibility','visible');
   pos2Dpoint3 = scene.projectPoint(scene.getObjectLocation("hotspot_4_SXM_top_03",true));
   var pos2Dpoint4 = [];
   var norm3Dpoint4 = scene.getObjectNormal("hotspot_4_SXM_top_04");
   var hotspotopacity4 = infinityrt_dp(norm3Dpoint4,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity4 > 0 && (hotspotOn == true)) hotspotopacity4 = 0;
   if (hotspotopacity4 < 0.0) hotspotopacity4 = 0.0;
   else if (hotspotopacity4 > 1.0) hotspotopacity4 = 1.0;
   if (hotspotopacity4 == 0) $("#hotspot4",window.document).css('visibility','hidden');
   else $("#hotspot4",window.document).css('visibility','visible');
   pos2Dpoint4 = scene.projectPoint(scene.getObjectLocation("hotspot_4_SXM_top_04",true));
   var pos2Dpoint5 = [];
   var norm3Dpoint5 = scene.getObjectNormal("hotspot_4_SXM_top_05");
   var hotspotopacity5 = infinityrt_dp(norm3Dpoint5,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity5 > 0 && (hotspotOn == true)) hotspotopacity5 = 0;
   if (hotspotopacity5 < 0.0) hotspotopacity5 = 0.0;
   else if (hotspotopacity5 > 1.0) hotspotopacity5 = 1.0;
   if (hotspotopacity5 == 0) $("#hotspot5",window.document).css('visibility','hidden');
   else $("#hotspot5",window.document).css('visibility','visible');
   pos2Dpoint5 = scene.projectPoint(scene.getObjectLocation("hotspot_4_SXM_top_05",true));

   var pos2Dpoint533 = [];
   var norm3Dpoint533 = scene.getObjectNormal("hotspot_4_SXM_Top_01");
   var hotspotopacity533 = infinityrt_dp(norm3Dpoint533,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity533 > 0 && (hotspotOn == true)) hotspotopacity533 = 0;
   if (hotspotopacity533 < 0.0) hotspotopacity533 = 0.0;
   else if (hotspotopacity533 > 1.0) hotspotopacity533 = 1.0;
   if (hotspotopacity533 == 0) $("#hotspot533",window.document).css('visibility','hidden');
   else $("#hotspot533",window.document).css('visibility','visible');
   pos2Dpoint533 = scene.projectPoint(scene.getObjectLocation("hotspot_4_SXM_Top_01",true));

   var pos2Dpoint6 = [];
   var norm3Dpoint6 = scene.getObjectNormal("hotspot_4_SXM_front_01");
   var hotspotopacity6 = infinityrt_dp(norm3Dpoint6,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity6 > 0 && (hotspotOn == true)) hotspotopacity6 = 0;
   if (hotspotopacity6 < 0.0) hotspotopacity6 = 0.0;
   else if (hotspotopacity6 > 1.0) hotspotopacity6 = 1.0;
   if (hotspotopacity6 == 0) $("#hotspot6",window.document).css('visibility','hidden');
   else $("#hotspot6",window.document).css('visibility','visible');
   pos2Dpoint6 = scene.projectPoint(scene.getObjectLocation("hotspot_4_SXM_front_01",true));
   var pos2Dpoint7 = [];
   var norm3Dpoint7 = scene.getObjectNormal("hotspot_4_SXM_front_02");
   var hotspotopacity7 = infinityrt_dp(norm3Dpoint7,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity7 > 0 && (hotspotOn == true)) hotspotopacity7 = 0;
   if (hotspotopacity7 < 0.0) hotspotopacity7 = 0.0;
   else if (hotspotopacity7 > 1.0) hotspotopacity7 = 1.0;
   if (hotspotopacity7 == 0) $("#hotspot7",window.document).css('visibility','hidden');
   else $("#hotspot7",window.document).css('visibility','visible');
   pos2Dpoint7 = scene.projectPoint(scene.getObjectLocation("hotspot_4_SXM_front_02",true));
   var pos2Dpoint8 = [];
   var norm3Dpoint8 = scene.getObjectNormal("hotspot_4_SXM_front_03");
   var hotspotopacity8 = infinityrt_dp(norm3Dpoint8,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity8 > 0 && (hotspotOn == true)) hotspotopacity8 = 0;
   if (hotspotopacity8 < 0.0) hotspotopacity8 = 0.0;
   else if (hotspotopacity8 > 1.0) hotspotopacity8 = 1.0;
   if (hotspotopacity8 == 0) $("#hotspot8",window.document).css('visibility','hidden');
   else $("#hotspot8",window.document).css('visibility','visible');
   pos2Dpoint8 = scene.projectPoint(scene.getObjectLocation("hotspot_4_SXM_front_03",true));
   var pos2Dpoint9 = [];
   var norm3Dpoint9 = scene.getObjectNormal("hotspot_4_SXM_front_01");
   var hotspotopacity9 = infinityrt_dp(norm3Dpoint9,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity9 > 0 && (hotspotOn == true)) hotspotopacity9 = 0;
   if (hotspotopacity9 < 0.0) hotspotopacity9 = 0.0;
   else if (hotspotopacity9 > 1.0) hotspotopacity9 = 1.0;
   if (hotspotopacity9 == 0) $("#hotspot9",window.document).css('visibility','hidden');
   else $("#hotspot9",window.document).css('visibility','visible');
   pos2Dpoint9 = scene.projectPoint(scene.getObjectLocation("hotspot_4_SXM_front_01",true));

   var pos2Dpoint511 = [];
   var norm3Dpoint511 = scene.getObjectNormal("hotspot_4_SXM_Front_04");
   var hotspotopacity511 = infinityrt_dp(norm3Dpoint511,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity511 > 0 && (hotspotOn == true)) hotspotopacity511 = 0;
   if (hotspotopacity511 < 0.0) hotspotopacity511 = 0.0;
   else if (hotspotopacity511 > 1.0) hotspotopacity511 = 1.0;
   if (hotspotopacity511 == 0) $("#hotspot511",window.document).css('visibility','hidden');
   else $("#hotspot511",window.document).css('visibility','visible');
   pos2Dpoint511 = scene.projectPoint(scene.getObjectLocation("hotspot_4_SXM_Front_04",true));
   //
   var pos2Dpoint10 = [];
   //    var norm3Dpoint10 = scene.getObjectNormal("Hotspot_Node_0Shape3-0");
   var norm3Dpoint10 = scene.getObjectNormal("hotspot_4_SXM_backside_01");
   var hotspotopacity10 = infinityrt_dp(norm3Dpoint10,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity10 > 0 && (hotspotOn == true)) hotspotopacity10 = 0;
   if (hotspotopacity10 < 0.0) hotspotopacity10 = 0.0;
   else if (hotspotopacity10 > 1.0) hotspotopacity10 = 1.0;
   if (hotspotopacity10 == 0) $("#hotspot10",window.document).css('visibility','hidden');
   else $("#hotspot10",window.document).css('visibility','visible');
   pos2Dpoint10 = scene.projectPoint(scene.getObjectLocation("hotspot_4_SXM_backside_01",true));
   //    pos2Dpoint10 = scene.projectPoint(scene.getObjectLocation("Hotspot_Node_0Shape3-0", true));
   var pos2Dpoint11 = [];
   //    var norm3Dpoint11 = scene.getObjectNormal("Hotspot_Node_0Shape4-0");
   var norm3Dpoint11 = scene.getObjectNormal("hotspot_4_SXM_backside_02");
   var hotspotopacity11 = infinityrt_dp(norm3Dpoint11,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity11 > 0 && (hotspotOn == true)) hotspotopacity11 = 0;
   if (hotspotopacity11 < 0.0) hotspotopacity11 = 0.0;
   else if (hotspotopacity11 > 1.0) hotspotopacity11 = 1.0;
   if (hotspotopacity11 == 0) $("#hotspot11",window.document).css('visibility','hidden');
   else $("#hotspot11",window.document).css('visibility','visible');
   pos2Dpoint11 = scene.projectPoint(scene.getObjectLocation("hotspot_4_SXM_backside_02",true));
   //    pos2Dpoint11 = scene.projectPoint(scene.getObjectLocation("Hotspot_Node_0Shape4-0", true));
   var pos2Dpoint12 = [];
   var norm3Dpoint12 = scene.getObjectNormal("hotspot_4_SXM_backside_03");
   var hotspotopacity12 = infinityrt_dp(norm3Dpoint12,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity12 > 0 && (hotspotOn == true)) hotspotopacity12 = 0;
   if (hotspotopacity12 < 0.0) hotspotopacity12 = 0.0;
   else if (hotspotopacity12 > 1.0) hotspotopacity12 = 1.0;
   if (hotspotopacity12 == 0) $("#hotspot12",window.document).css('visibility','hidden');
   else $("#hotspot12",window.document).css('visibility','visible');
   pos2Dpoint12 = scene.projectPoint(scene.getObjectLocation("hotspot_4_SXM_backside_03",true));
   var pos2Dpoint13 = [];
   var norm3Dpoint13 = scene.getObjectNormal("hotspot_4_SXM_backside_04");
   var hotspotopacity13 = infinityrt_dp(norm3Dpoint13,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity13 > 0 && (hotspotOn == true)) hotspotopacity13 = 0;
   if (hotspotopacity13 < 0.0) hotspotopacity13 = 0.0;
   else if (hotspotopacity13 > 1.0) hotspotopacity13 = 1.0;
   if (hotspotopacity13 == 0) $("#hotspot13",window.document).css('visibility','hidden');
   else $("#hotspot13",window.document).css('visibility','visible');
   pos2Dpoint13 = scene.projectPoint(scene.getObjectLocation("hotspot_4_SXM_backside_04",true));
   var pos2Dpoint14 = [];
   var norm3Dpoint14 = scene.getObjectNormal("hotspot_4_SXM_backside_05");
   var hotspotopacity14 = infinityrt_dp(norm3Dpoint14,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity14 > 0 && (hotspotOn == true)) hotspotopacity14 = 0;
   if (hotspotopacity14 < 0.0) hotspotopacity14 = 0.0;
   else if (hotspotopacity14 > 1.0) hotspotopacity14 = 1.0;
   if (hotspotopacity14 == 0) $("#hotspot14",window.document).css('visibility','hidden');
   else $("#hotspot14",window.document).css('visibility','visible');
   pos2Dpoint14 = scene.projectPoint(scene.getObjectLocation("hotspot_4_SXM_backside_05",true));
   var pos2Dpoint15 = [];
   var norm3Dpoint15 = scene.getObjectNormal("hotspot_4_SXM_backside_06");
   var hotspotopacity15 = infinityrt_dp(norm3Dpoint15,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity15 > 0 && (hotspotOn == true)) hotspotopacity15 = 0;
   if (hotspotopacity15 < 0.0) hotspotopacity15 = 0.0;
   else if (hotspotopacity15 > 1.0) hotspotopacity15 = 1.0;
   if (hotspotopacity15 == 0) $("#hotspot15",window.document).css('visibility','hidden');
   else $("#hotspot15",window.document).css('visibility','visible');
   pos2Dpoint15 = scene.projectPoint(scene.getObjectLocation("hotspot_4_SXM_backside_06",true));
   var pos2Dpoint16 = [];
   var norm3Dpoint16 = scene.getObjectNormal("hotspot_4_SXM_backside_07");
   var hotspotopacity16 = infinityrt_dp(norm3Dpoint16,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity16 > 0 && (hotspotOn == true)) hotspotopacity16 = 0;
   if (hotspotopacity16 < 0.0) hotspotopacity16 = 0.0;
   else if (hotspotopacity16 > 1.0) hotspotopacity16 = 1.0;
   if (hotspotopacity16 == 0) $("#hotspot16",window.document).css('visibility','hidden');
   else $("#hotspot16",window.document).css('visibility','visible');
   pos2Dpoint16 = scene.projectPoint(scene.getObjectLocation("hotspot_4_SXM_backside_07",true));
   var pos2Dpoint17 = [];
   var norm3Dpoint17 = scene.getObjectNormal("hotspot_4_SXM_backside_08");
   var hotspotopacity17 = infinityrt_dp(norm3Dpoint17,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity17 > 0 && (hotspotOn == true)) hotspotopacity17 = 0;
   if (hotspotopacity17 < 0.0) hotspotopacity17 = 0.0;
   else if (hotspotopacity17 > 1.0) hotspotopacity17 = 1.0;
   if (hotspotopacity17 == 0) $("#hotspot17",window.document).css('visibility','hidden');
   else $("#hotspot17",window.document).css('visibility','visible');
   pos2Dpoint17 = scene.projectPoint(scene.getObjectLocation("hotspot_4_SXM_backside_08",true));
   var pos2Dpoint18 = [];
   var norm3Dpoint18 = scene.getObjectNormal("hotspot_4_SXM_backside_09");
   var hotspotopacity18 = infinityrt_dp(norm3Dpoint18,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity18 > 0 && (hotspotOn == true)) hotspotopacity18 = 0;
   if (hotspotopacity18 < 0.0) hotspotopacity18 = 0.0;
   else if (hotspotopacity18 > 1.0) hotspotopacity18 = 1.0;
   if (hotspotopacity18 == 0) $("#hotspot18",window.document).css('visibility','hidden');
   else $("#hotspot18",window.document).css('visibility','visible');
   pos2Dpoint18 = scene.projectPoint(scene.getObjectLocation("hotspot_4_SXM_backside_09",true));
   //
   var pos2Dpoint19 = [];
   var norm3Dpoint19 = scene.getObjectNormal("hotspot_8_DW_top_02");
   var hotspotopacity19 = infinityrt_dp(norm3Dpoint19,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity19 > 0 && (hotspotOn == true)) hotspotopacity19 = 0;
   if (hotspotopacity19 < 0.0) hotspotopacity19 = 0.0;
   else if (hotspotopacity19 > 1.0) hotspotopacity19 = 1.0;
   if (hotspotopacity19 == 0) $("#hotspot19",window.document).css('visibility','hidden');
   else $("#hotspot19",window.document).css('visibility','visible');
   pos2Dpoint19 = scene.projectPoint(scene.getObjectLocation("hotspot_8_DW_top_02",true));
   var pos2Dpoint20 = [];
   var norm3Dpoint20 = scene.getObjectNormal("hotspot_8_DW_top_01");
   var hotspotopacity20 = infinityrt_dp(norm3Dpoint20,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity20 > 0 && (hotspotOn == true)) hotspotopacity20 = 0;
   if (hotspotopacity20 < 0.0) hotspotopacity20 = 0.0;
   else if (hotspotopacity20 > 1.0) hotspotopacity20 = 1.0;
   if (hotspotopacity20 == 0) $("#hotspot20",window.document).css('visibility','hidden');
   else $("#hotspot20",window.document).css('visibility','visible');
   pos2Dpoint20 = scene.projectPoint(scene.getObjectLocation("hotspot_8_DW_top_01",true));
   var pos2Dpoint21 = [];
   var norm3Dpoint21 = scene.getObjectNormal("hotspot_8_DW_top_03");
   var hotspotopacity21 = infinityrt_dp(norm3Dpoint21,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity21 > 0 && (hotspotOn == true)) hotspotopacity21 = 0;
   if (hotspotopacity21 < 0.0) hotspotopacity21 = 0.0;
   else if (hotspotopacity21 > 1.0) hotspotopacity21 = 1.0;
   if (hotspotopacity21 == 0) $("#hotspot21",window.document).css('visibility','hidden');
   else $("#hotspot21",window.document).css('visibility','visible');
   pos2Dpoint21 = scene.projectPoint(scene.getObjectLocation("hotspot_8_DW_top_03",true));
   var pos2Dpoint22 = [];
   var norm3Dpoint22 = scene.getObjectNormal("hotspot_8_DW_top_04");
   var hotspotopacity22 = infinityrt_dp(norm3Dpoint22,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity22 > 0 && (hotspotOn == true)) hotspotopacity22 = 0;
   if (hotspotopacity22 < 0.0) hotspotopacity22 = 0.0;
   else if (hotspotopacity22 > 1.0) hotspotopacity22 = 1.0;
   if (hotspotopacity22 == 0) $("#hotspot22",window.document).css('visibility','hidden');
   else $("#hotspot22",window.document).css('visibility','visible');
   pos2Dpoint22 = scene.projectPoint(scene.getObjectLocation("hotspot_8_DW_top_04",true));
   var pos2Dpoint23 = [];
   var norm3Dpoint23 = scene.getObjectNormal("hotspot_8_DW_top_05");
   var hotspotopacity23 = infinityrt_dp(norm3Dpoint23,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity23 > 0 && (hotspotOn == true)) hotspotopacity23 = 0;
   if (hotspotopacity23 < 0.0) hotspotopacity23 = 0.0;
   else if (hotspotopacity23 > 1.0) hotspotopacity23 = 1.0;
   if (hotspotopacity23 == 0) $("#hotspot23",window.document).css('visibility','hidden');
   else $("#hotspot23",window.document).css('visibility','visible');
   pos2Dpoint23 = scene.projectPoint(scene.getObjectLocation("hotspot_8_DW_top_05",true));
   var pos2Dpoint24 = [];
   var norm3Dpoint24 = scene.getObjectNormal("hotspot_8_DW_top_06");
   var hotspotopacity24 = infinityrt_dp(norm3Dpoint24,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity24 > 0 && (hotspotOn == true)) hotspotopacity24 = 0;
   if (hotspotopacity24 < 0.0) hotspotopacity24 = 0.0;
   else if (hotspotopacity24 > 1.0) hotspotopacity24 = 1.0;
   if (hotspotopacity24 == 0) $("#hotspot24",window.document).css('visibility','hidden');
   else $("#hotspot24",window.document).css('visibility','visible');
   pos2Dpoint24 = scene.projectPoint(scene.getObjectLocation("hotspot_8_DW_top_06",true));


   var pos2Dpoint019 = [];
   var norm3Dpoint019 = scene.getObjectNormal("hotspot_8_DW_top_02");
   var hotspotopacity019 = infinityrt_dp(norm3Dpoint019,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity019 > 0 && (hotspotOn == true)) hotspotopacity019 = 0;
   if (hotspotopacity019 < 0.0) hotspotopacity019 = 0.0;
   else if (hotspotopacity019 > 1.0) hotspotopacity019 = 1.0;
   if (hotspotopacity019 == 0) $("#hotspot019",window.document).css('visibility','hidden');
   else $("#hotspot019",window.document).css('visibility','visible');
   pos2Dpoint019 = scene.projectPoint(scene.getObjectLocation("hotspot_8_DW_top_02",true));
   var pos2Dpoint020 = [];
   var norm3Dpoint020 = scene.getObjectNormal("hotspot_8_DW_top_01");
   var hotspotopacity020 = infinityrt_dp(norm3Dpoint020,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity020 > 0 && (hotspotOn == true)) hotspotopacity020 = 0;
   if (hotspotopacity020 < 0.0) hotspotopacity020 = 0.0;
   else if (hotspotopacity020 > 1.0) hotspotopacity020 = 1.0;
   if (hotspotopacity020 == 0) $("#hotspot020",window.document).css('visibility','hidden');
   else $("#hotspot020",window.document).css('visibility','visible');
   pos2Dpoint020 = scene.projectPoint(scene.getObjectLocation("hotspot_8_DW_top_01",true));
   var pos2Dpoint021 = [];
   var norm3Dpoint021 = scene.getObjectNormal("hotspot_8_DW_top_03");
   var hotspotopacity021 = infinityrt_dp(norm3Dpoint021,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity021 > 0 && (hotspotOn == true)) hotspotopacity021 = 0;
   if (hotspotopacity021 < 0.0) hotspotopacity021 = 0.0;
   else if (hotspotopacity021 > 1.0) hotspotopacity021 = 1.0;
   if (hotspotopacity021 == 0) $("#hotspot021",window.document).css('visibility','hidden');
   else $("#hotspot021",window.document).css('visibility','visible');
   pos2Dpoint021 = scene.projectPoint(scene.getObjectLocation("hotspot_8_DW_top_03",true));
   var pos2Dpoint022 = [];
   var norm3Dpoint022 = scene.getObjectNormal("hotspot_8_DW_top_04");
   var hotspotopacity022 = infinityrt_dp(norm3Dpoint022,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity022 > 0 && (hotspotOn == true)) hotspotopacity022 = 0;
   if (hotspotopacity022 < 0.0) hotspotopacity022 = 0.0;
   else if (hotspotopacity022 > 1.0) hotspotopacity022 = 1.0;
   if (hotspotopacity022 == 0) $("#hotspot022",window.document).css('visibility','hidden');
   else $("#hotspot022",window.document).css('visibility','visible');
   pos2Dpoint022 = scene.projectPoint(scene.getObjectLocation("hotspot_8_DW_top_04",true));
   var pos2Dpoint023 = [];
   var norm3Dpoint023 = scene.getObjectNormal("hotspot_8_DW_top_05");
   var hotspotopacity023 = infinityrt_dp(norm3Dpoint023,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity023 > 0 && (hotspotOn == true)) hotspotopacity023 = 0;
   if (hotspotopacity023 < 0.0) hotspotopacity023 = 0.0;
   else if (hotspotopacity023 > 1.0) hotspotopacity023 = 1.0;
   if (hotspotopacity023 == 0) $("#hotspot023",window.document).css('visibility','hidden');
   else $("#hotspot023",window.document).css('visibility','visible');
   pos2Dpoint023 = scene.projectPoint(scene.getObjectLocation("hotspot_8_DW_top_05",true));
   var pos2Dpoint024 = [];
   var norm3Dpoint024 = scene.getObjectNormal("hotspot_8_DW_top_06");
   var hotspotopacity024 = infinityrt_dp(norm3Dpoint024,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity024 > 0 && (hotspotOn == true)) hotspotopacity024 = 0;
   if (hotspotopacity024 < 0.0) hotspotopacity024 = 0.0;
   else if (hotspotopacity024 > 1.0) hotspotopacity024 = 1.0;
   if (hotspotopacity024 == 0) $("#hotspot024",window.document).css('visibility','hidden');
   else $("#hotspot024",window.document).css('visibility','visible');
   pos2Dpoint024 = scene.projectPoint(scene.getObjectLocation("hotspot_8_DW_top_06",true));

   //
   //    var pos2Dpoint25 = [];
   //    var norm3Dpoint25 = scene.getObjectNormal("Internal_Hotspot_7Shape-0");
   //    var hotspotopacity25 = infinityrt_dp(norm3Dpoint25, viewCameraZV) * hotspotopacityspeed - 2.98;
   //    if (hotspotopacity25 > 0 && (hotspotOn == true)) hotspotopacity25 = 0;
   //    if (hotspotopacity25 < 0.0) hotspotopacity25 = 0.0;
   //    else if (hotspotopacity25 > 1.0) hotspotopacity25 = 1.0;
   //    if (hotspotopacity25 == 0) $("#hotspot25", window.document).css('visibility', 'hidden');
   //    else $("#hotspot25", window.document).css('visibility', 'visible');
   //    pos2Dpoint25 = scene.projectPoint(scene.getObjectLocation("Internal_Hotspot_7Shape-0", true));
   //
   var pos2Dpoint26 = [];
   var norm3Dpoint26 = scene.getObjectNormal("hotspot_8_DW_front_02");
   var hotspotopacity26 = infinityrt_dp(norm3Dpoint26,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity26 > 0 && (hotspotOn == true)) hotspotopacity26 = 0;
   if (hotspotopacity26 < 0.0) hotspotopacity26 = 0.0;
   else if (hotspotopacity26 > 1.0) hotspotopacity26 = 1.0;
   if (hotspotopacity26 == 0) $("#hotspot26",window.document).css('visibility','hidden');
   else $("#hotspot26",window.document).css('visibility','visible');
   pos2Dpoint26 = scene.projectPoint(scene.getObjectLocation("hotspot_8_DW_front_02",true));
   var pos2Dpoint27 = [];
   var norm3Dpoint27 = scene.getObjectNormal("hotspot_8_DW_front_01");
   var hotspotopacity27 = infinityrt_dp(norm3Dpoint27,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity27 > 0 && (hotspotOn == true)) hotspotopacity27 = 0;
   if (hotspotopacity27 < 0.0) hotspotopacity27 = 0.0;
   else if (hotspotopacity27 > 1.0) hotspotopacity27 = 1.0;
   if (hotspotopacity27 == 0) $("#hotspot27",window.document).css('visibility','hidden');
   else $("#hotspot27",window.document).css('visibility','visible');
   pos2Dpoint27 = scene.projectPoint(scene.getObjectLocation("hotspot_8_DW_front_01",true));
   var pos2Dpoint28 = [];
   var norm3Dpoint28 = scene.getObjectNormal("hotspot_8_DW_front_03");
   var hotspotopacity28 = infinityrt_dp(norm3Dpoint28,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity28 > 0 && (hotspotOn == true)) hotspotopacity28 = 0;
   if (hotspotopacity28 < 0.0) hotspotopacity28 = 0.0;
   else if (hotspotopacity28 > 1.0) hotspotopacity28 = 1.0;
   if (hotspotopacity28 == 0) $("#hotspot28",window.document).css('visibility','hidden');
   else $("#hotspot28",window.document).css('visibility','visible');
   pos2Dpoint28 = scene.projectPoint(scene.getObjectLocation("hotspot_8_DW_front_03",true));
   var pos2Dpoint29 = [];
   var norm3Dpoint29 = scene.getObjectNormal("hotspot_8_DW_front_04");
   var hotspotopacity29 = infinityrt_dp(norm3Dpoint29,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity29 > 0 && (hotspotOn == true)) hotspotopacity29 = 0;
   if (hotspotopacity29 < 0.0) hotspotopacity29 = 0.0;
   else if (hotspotopacity29 > 1.0) hotspotopacity29 = 1.0;
   if (hotspotopacity29 == 0) $("#hotspot29",window.document).css('visibility','hidden');
   else $("#hotspot29",window.document).css('visibility','visible');
   pos2Dpoint29 = scene.projectPoint(scene.getObjectLocation("hotspot_8_DW_front_04",true));
   var pos2Dpoint30 = [];
   var norm3Dpoint30 = scene.getObjectNormal("hotspot_8_DW_front_05");
   var hotspotopacity30 = infinityrt_dp(norm3Dpoint30,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity30 > 0 && (hotspotOn == true)) hotspotopacity30 = 0;
   if (hotspotopacity30 < 0.0) hotspotopacity30 = 0.0;
   else if (hotspotopacity30 > 1.0) hotspotopacity30 = 1.0;
   if (hotspotopacity30 == 0) $("#hotspot30",window.document).css('visibility','hidden');
   else $("#hotspot30",window.document).css('visibility','visible');
   pos2Dpoint30 = scene.projectPoint(scene.getObjectLocation("hotspot_8_DW_front_05",true));
   //
   //    var pos2Dpoint31 = [];
   //    var norm3Dpoint31 = scene.getObjectNormal("hotspot_4_SXM_backside_01");
   //    var hotspotopacity31 = infinityrt_dp(norm3Dpoint31, viewCameraZV) * hotspotopacityspeed - 2.98;
   //    if (hotspotopacity31 > 0 && (hotspotOn == true)) hotspotopacity31 = 0;
   //    if (hotspotopacity31 < 0.0) hotspotopacity31 = 0.0;
   //    else if (hotspotopacity31 > 1.0) hotspotopacity31 = 1.0;
   //    if (hotspotopacity31 == 0) $("#hotspot31", window.document).css('visibility', 'hidden');
   //    else $("#hotspot31", window.document).css('visibility', 'visible');
   //    pos2Dpoint31 = scene.projectPoint(scene.getObjectLocation("hotspot_4_SXM_backside_01", true));
   //
   //    var pos2Dpoint32 = [];
   //    var norm3Dpoint32 = scene.getObjectNormal("hotspot_4_SXM_backside_02");
   //    var hotspotopacity32 = infinityrt_dp(norm3Dpoint32, viewCameraZV) * hotspotopacityspeed - 2.98;
   //    if (hotspotopacity32 > 0 && (hotspotOn == true)) hotspotopacity32 = 0;
   //    if (hotspotopacity32 < 0.0) hotspotopacity32 = 0.0;
   //    else if (hotspotopacity32 > 1.0) hotspotopacity32 = 1.0;
   //    if (hotspotopacity32 == 0) $("#hotspot32", window.document).css('visibility', 'hidden');
   //    else $("#hotspot32", window.document).css('visibility', 'visible');
   //    pos2Dpoint32 = scene.projectPoint(scene.getObjectLocation("hotspot_4_SXM_backside_02", true));
   //
   //    var pos2Dpoint33 = [];
   //    var norm3Dpoint33 = scene.getObjectNormal("hotspot_4_SXM_backside_03");
   //    var hotspotopacity33 = infinityrt_dp(norm3Dpoint33, viewCameraZV) * hotspotopacityspeed - 2.98;
   //    if (hotspotopacity33 > 0 && (hotspotOn == true)) hotspotopacity33 = 0;
   //    if (hotspotopacity33 < 0.0) hotspotopacity33 = 0.0;
   //    else if (hotspotopacity33 > 1.0) hotspotopacity33 = 1.0;
   //    if (hotspotopacity33 == 0) $("#hotspot33", window.document).css('visibility', 'hidden');
   //    else $("#hotspot33", window.document).css('visibility', 'visible');
   //    pos2Dpoint33 = scene.projectPoint(scene.getObjectLocation("hotspot_4_SXM_backside_03", true));
   //
   //    var pos2Dpoint34 = [];
   //    var norm3Dpoint34 = scene.getObjectNormal("hotspot_4_SXM_backside_04");
   //    var hotspotopacity34 = infinityrt_dp(norm3Dpoint34, viewCameraZV) * hotspotopacityspeed - 2.98;
   //    if (hotspotopacity34 > 0 && (hotspotOn == true)) hotspotopacity34 = 0;
   //    if (hotspotopacity34 < 0.0) hotspotopacity34 = 0.0;
   //    else if (hotspotopacity34 > 1.0) hotspotopacity34 = 1.0;
   //    if (hotspotopacity34 == 0) $("#hotspot34", window.document).css('visibility', 'hidden');
   //    else $("#hotspot34", window.document).css('visibility', 'visible');
   //    pos2Dpoint34 = scene.projectPoint(scene.getObjectLocation("hotspot_4_SXM_backside_04", true));
   //
   //    var pos2Dpoint35 = [];
   //    var norm3Dpoint35 = scene.getObjectNormal("hotspot_4_SXM_backside_05");
   //    var hotspotopacity35 = infinityrt_dp(norm3Dpoint35, viewCameraZV) * hotspotopacityspeed - 2.98;
   //    if (hotspotopacity35 > 0 && (hotspotOn == true)) hotspotopacity35 = 0;
   //    if (hotspotopacity35 < 0.0) hotspotopacity35 = 0.0;
   //    else if (hotspotopacity35 > 1.0) hotspotopacity35 = 1.0;
   //    if (hotspotopacity35 == 0) $("#hotspot35", window.document).css('visibility', 'hidden');
   //    else $("#hotspot35", window.document).css('visibility', 'visible');
   //    pos2Dpoint35 = scene.projectPoint(scene.getObjectLocation("hotspot_4_SXM_backside_05", true));
   //
   //        var pos2Dpoint36 = [];
   //    	var norm3Dpoint36 = scene.getObjectNormal("hotspot_4_SXM_backside_06");
   //    	var hotspotopacity36 = infinityrt_dp(norm3Dpoint36, viewCameraZV) * hotspotopacityspeed-2.98;
   //    	if(hotspotopacity36>0 && (hotspotOn == true )) hotspotopacity36=0;
   //    	if (hotspotopacity36 < 0.0) hotspotopacity36 = 0.0;
   //    	else if (hotspotopacity36 > 1.0) hotspotopacity36 = 1.0;
   //    	if(hotspotopacity36==0)$("#hotspot36", window.document).css('visibility','hidden');
   //    	else $("#hotspot36", window.document).css('visibility','visible');
   //    	pos2Dpoint36 = scene.projectPoint(scene.getObjectLocation("hotspot_4_SXM_backside_06", true));
   ////
   //    var pos2Dpoint50 = [];
   //    var norm3Dpoint50 = scene.getObjectNormal("Internal_Hotspot_12Shape-0");
   //    var hotspotopacity50 = infinityrt_dp(norm3Dpoint50, viewCameraZV) * hotspotopacityspeed - 2.98;
   //    if (hotspotopacity50 > 0 && (hotspotOn == true)) hotspotopacity50 = 0;
   //    if (hotspotopacity50 < 0.0) hotspotopacity50 = 0.0;
   //    else if (hotspotopacity50 > 1.0) hotspotopacity50 = 1.0;
   //    if (hotspotopacity50 == 0) $("#hotspot50", window.document).css('visibility', 'hidden');
   //    else $("#hotspot50", window.document).css('visibility', 'visible');
   //    pos2Dpoint50 = scene.projectPoint(scene.getObjectLocation("Internal_Hotspot_12Shape-0", true));
   //    
   //for new rear view start //
   var pos2Dpoint40 = [];
   var norm3Dpoint40 = scene.getObjectNormal("hotspot_8_SW_top_02");
   //    var norm3Dpoint40 = scene.getObjectNormal("Hotspot_Component_0Shape1-0");
   var hotspotopacity40 = infinityrt_dp(norm3Dpoint40,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity40 > 0 && (hotspotOn == true)) hotspotopacity40 = 0;
   if (hotspotopacity40 < 0.0) hotspotopacity40 = 0.0;
   else if (hotspotopacity40 > 1.0) hotspotopacity40 = 1.0;
   if (hotspotopacity40 == 0) $("#hotspot40",window.document).css('visibility','hidden');
   else $("#hotspot40",window.document).css('visibility','visible');
   pos2Dpoint40 = scene.projectPoint(scene.getObjectLocation("hotspot_8_SW_top_02",true));
   //    pos2Dpoint40 = scene.projectPoint(scene.getObjectLocation("Hotspot_Component_0Shape1-0", true));

   var pos2Dpoint41 = [];
   var norm3Dpoint41 = scene.getObjectNormal("hotspot_8_SW_top_01");
   //    var norm3Dpoint41 = scene.getObjectNormal("Hotspot_Component_0Shape3-0");
   var hotspotopacity41 = infinityrt_dp(norm3Dpoint41,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity41 > 0 && (hotspotOn == true)) hotspotopacity41 = 0;
   if (hotspotopacity41 < 0.0) hotspotopacity41 = 0.0;
   else if (hotspotopacity41 > 1.0) hotspotopacity41 = 1.0;
   if (hotspotopacity41 == 0) $("#hotspot41",window.document).css('visibility','hidden');
   else $("#hotspot41",window.document).css('visibility','visible');
   pos2Dpoint41 = scene.projectPoint(scene.getObjectLocation("hotspot_8_SW_top_01",true));
   //    pos2Dpoint41 = scene.projectPoint(scene.getObjectLocation("Hotspot_Component_0Shape3-0", true));

   var pos2Dpoint42 = [];
   var norm3Dpoint42 = scene.getObjectNormal("hotspot_8_SW_top_03");
   //    var norm3Dpoint42 = scene.getObjectNormal("Hotspot_Component_0Shape5-0");
   var hotspotopacity42 = infinityrt_dp(norm3Dpoint42,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity42 > 0 && (hotspotOn == true)) hotspotopacity42 = 0;
   if (hotspotopacity42 < 0.0) hotspotopacity42 = 0.0;
   else if (hotspotopacity42 > 1.0) hotspotopacity42 = 1.0;
   if (hotspotopacity42 == 0) $("#hotspot42",window.document).css('visibility','hidden');
   else $("#hotspot42",window.document).css('visibility','visible');
   pos2Dpoint42 = scene.projectPoint(scene.getObjectLocation("hotspot_8_SW_top_03",true));
   //    pos2Dpoint42 = scene.projectPoint(scene.getObjectLocation("Hotspot_Component_0Shape5-0", true));

   var pos2Dpoint43 = [];
   var norm3Dpoint43 = scene.getObjectNormal("hotspot_8_SW_top_04");
   //    var norm3Dpoint43 = scene.getObjectNormal("Hotspot_Component_0Shape7-0");
   var hotspotopacity43 = infinityrt_dp(norm3Dpoint43,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity43 > 0 && (hotspotOn == true)) hotspotopacity43 = 0;
   if (hotspotopacity43 < 0.0) hotspotopacity43 = 0.0;
   else if (hotspotopacity43 > 1.0) hotspotopacity43 = 1.0;
   if (hotspotopacity43 == 0) $("#hotspot43",window.document).css('visibility','hidden');
   else $("#hotspot43",window.document).css('visibility','visible');
   pos2Dpoint43 = scene.projectPoint(scene.getObjectLocation("hotspot_8_SW_top_04",true));
   //    pos2Dpoint43 = scene.projectPoint(scene.getObjectLocation("Hotspot_Component_0Shape7-0", true));

   var pos2Dpoint44 = [];
   //    var norm3Dpoint44 = scene.getObjectNormal("Hotspot_Component_0Shape8-0");
   var norm3Dpoint44 = scene.getObjectNormal("hotspot_8_SW_top_05");
   var hotspotopacity44 = infinityrt_dp(norm3Dpoint44,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity44 > 0 && (hotspotOn == true)) hotspotopacity44 = 0;
   if (hotspotopacity44 < 0.0) hotspotopacity44 = 0.0;
   else if (hotspotopacity44 > 1.0) hotspotopacity44 = 1.0;
   if (hotspotopacity44 == 0) $("#hotspot44",window.document).css('visibility','hidden');
   else $("#hotspot44",window.document).css('visibility','visible');
   pos2Dpoint44 = scene.projectPoint(scene.getObjectLocation("hotspot_8_SW_top_05",true));

   var pos2Dpoint45 = [];
   var norm3Dpoint45 = scene.getObjectNormal("hotspot_8_SW_top_07");
   var hotspotopacity45 = infinityrt_dp(norm3Dpoint45,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity45 > 0 && (hotspotOn == true)) hotspotopacity45 = 0;
   if (hotspotopacity45 < 0.0) hotspotopacity45 = 0.0;
   else if (hotspotopacity45 > 1.0) hotspotopacity45 = 1.0;
   if (hotspotopacity45 == 0) $("#hotspot45",window.document).css('visibility','hidden');
   else $("#hotspot45",window.document).css('visibility','visible');
   pos2Dpoint45 = scene.projectPoint(scene.getObjectLocation("hotspot_8_SW_top_07",true));

   var pos2Dpoint46 = [];
   var norm3Dpoint46 = scene.getObjectNormal("hotspot_8_SW_top_06a");
   var hotspotopacity46 = infinityrt_dp(norm3Dpoint46,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity46 > 0 && (hotspotOn == true)) hotspotopacity46 = 0;
   if (hotspotopacity46 < 0.0) hotspotopacity46 = 0.0;
   else if (hotspotopacity46 > 1.0) hotspotopacity46 = 1.0;
   if (hotspotopacity46 == 0) $("#hotspot46",window.document).css('visibility','hidden');
   else $("#hotspot46",window.document).css('visibility','visible');
   pos2Dpoint46 = scene.projectPoint(scene.getObjectLocation("hotspot_8_SW_top_06a",true));
   //    
   ////    Front face Bay hotspots

   //    
   //      var pos2Dpoint52 = []; 
   //    var norm3Dpoint52 = scene.getObjectNormal("Front_Hotspot2");
   //    var hotspotopacity52 = infinityrt_dp(norm3Dpoint52, viewCameraZV) * hotspotopacityspeed - 2.98;
   //    if (hotspotopacity52 > 0 && (hotspotOn == true)) hotspotopacity52 = 0;
   //    if (hotspotopacity52 < 0.0) hotspotopacity52 = 0.0;
   //    else if (hotspotopacity52 > 1.0) hotspotopacity52 = 1.0;
   //    if (hotspotopacity52 == 0) $("#hotspot52", window.document).css('visibility', 'hidden');
   //    else $("#hotspot52", window.document).css('visibility', 'visible');
   //    pos2Dpoint52 = scene.projectPoint(scene.getObjectLocation("Front_Hotspot2", true)); 
   //    
   //     var pos2Dpoint53 = []; 
   //    var norm3Dpoint53 = scene.getObjectNormal("Front_Hotspot3");
   //    var hotspotopacity53 = infinityrt_dp(norm3Dpoint53, viewCameraZV) * hotspotopacityspeed - 2.98;
   //    if (hotspotopacity53 > 0 && (hotspotOn == true)) hotspotopacity53 = 0;
   //    if (hotspotopacity53 < 0.0) hotspotopacity53 = 0.0;
   //    else if (hotspotopacity53 > 1.0) hotspotopacity53 = 1.0;
   //    if (hotspotopacity53 == 0) $("#hotspot53", window.document).css('visibility', 'hidden');
   //    else $("#hotspot53", window.document).css('visibility', 'visible');
   //    pos2Dpoint53 = scene.projectPoint(scene.getObjectLocation("Front_Hotspot3", true)); 
   //    
   //     var pos2Dpoint54 = []; 
   //    var norm3Dpoint54 = scene.getObjectNormal("Front_Hotspot4");
   //    var hotspotopacity54 = infinityrt_dp(norm3Dpoint54, viewCameraZV) * hotspotopacityspeed - 2.98;
   //    if (hotspotopacity54 > 0 && (hotspotOn == true)) hotspotopacity54 = 0;
   //    if (hotspotopacity54 < 0.0) hotspotopacity54 = 0.0;
   //    else if (hotspotopacity54 > 1.0) hotspotopacity54 = 1.0;
   //    if (hotspotopacity54 == 0) $("#hotspot54", window.document).css('visibility', 'hidden');
   //    else $("#hotspot54", window.document).css('visibility', 'visible');
   //    pos2Dpoint54 = scene.projectPoint(scene.getObjectLocation("Front_Hotspot4", true)); 
   //    
   //     var pos2Dpoint55 = []; 
   //    var norm3Dpoint55 = scene.getObjectNormal("Front_Hotspot5");
   //    var hotspotopacity55 = infinityrt_dp(norm3Dpoint55, viewCameraZV) * hotspotopacityspeed - 2.98;
   //    if (hotspotopacity55 > 0 && (hotspotOn == true)) hotspotopacity55 = 0;
   //    if (hotspotopacity55 < 0.0) hotspotopacity55 = 0.0;
   //    else if (hotspotopacity52 > 1.0) hotspotopacity55 = 1.0;
   //    if (hotspotopacity55 == 0) $("#hotspot55", window.document).css('visibility', 'hidden');
   //    else $("#hotspot55", window.document).css('visibility', 'visible');
   //    pos2Dpoint55 = scene.projectPoint(scene.getObjectLocation("Front_Hotspot2", true)); 
   //    
   //     var pos2Dpoint56 = []; 
   //    var norm3Dpoint56 = scene.getObjectNormal("Front_Hotspot6");
   //    var hotspotopacity56 = infinityrt_dp(norm3Dpoint56, viewCameraZV) * hotspotopacityspeed - 2.98;
   //    if (hotspotopacity56 > 0 && (hotspotOn == true)) hotspotopacity56 = 0;
   //    if (hotspotopacity56 < 0.0) hotspotopacity56 = 0.0;
   //    else if (hotspotopacity56 > 1.0) hotspotopacity56 = 1.0;
   //    if (hotspotopacity56 == 0) $("#hotspot56", window.document).css('visibility', 'hidden');
   //    else $("#hotspot56", window.document).css('visibility', 'visible');
   //    pos2Dpoint56 = scene.projectPoint(scene.getObjectLocation("Front_Hotspot6", true)); 
   //    
   //     var pos2Dpoint57 = []; 
   //    var norm3Dpoint57 = scene.getObjectNormal("Front_Hotspot7");
   //    var hotspotopacity57 = infinityrt_dp(norm3Dpoint57, viewCameraZV) * hotspotopacityspeed - 2.98;
   //    if (hotspotopacity57 > 0 && (hotspotOn == true)) hotspotopacity57 = 0;
   //    if (hotspotopacity57 < 0.0) hotspotopacity57 = 0.0;
   //    else if (hotspotopacity57 > 1.0) hotspotopacity57 = 1.0;
   //    if (hotspotopacity57 == 0) $("#hotspot57", window.document).css('visibility', 'hidden');
   //    else $("#hotspot57", window.document).css('visibility', 'visible');
   //    pos2Dpoint57 = scene.projectPoint(scene.getObjectLocation("Front_Hotspot7", true)); 
   //    
   //     var pos2Dpoint58 = []; 
   //    var norm3Dpoint58 = scene.getObjectNormal("Front_Hotspot8");
   //    var hotspotopacity58 = infinityrt_dp(norm3Dpoint58, viewCameraZV) * hotspotopacityspeed - 2.98;
   //    if (hotspotopacity58 > 0 && (hotspotOn == true)) hotspotopacity58 = 0;
   //    if (hotspotopacity58 < 0.0) hotspotopacity58 = 0.0;
   //    else if (hotspotopacity58 > 1.0) hotspotopacity58 = 1.0;
   //    if (hotspotopacity58 == 0) $("#hotspot58", window.document).css('visibility', 'hidden');
   //    else $("#hotspot58", window.document).css('visibility', 'visible');
   //    pos2Dpoint58 = scene.projectPoint(scene.getObjectLocation("Front_Hotspot8", true)); 
   //    
   //     var pos2Dpoint59 = []; 
   //    var norm3Dpoint59 = scene.getObjectNormal("Front_Hotspot9");
   //    var hotspotopacity59 = infinityrt_dp(norm3Dpoint59, viewCameraZV) * hotspotopacityspeed - 2.98;
   //    if (hotspotopacity59 > 0 && (hotspotOn == true)) hotspotopacity59 = 0;
   //    if (hotspotopacity59 < 0.0) hotspotopacity59 = 0.0;
   //    else if (hotspotopacity59 > 1.0) hotspotopacity59 = 1.0;
   //    if (hotspotopacity59 == 0) $("#hotspot59", window.document).css('visibility', 'hidden');
   //    else $("#hotspot59", window.document).css('visibility', 'visible');
   //    pos2Dpoint59 = scene.projectPoint(scene.getObjectLocation("Front_Hotspot9", true)); 
   //    
   //     var pos2Dpoint60 = []; 
   //    var norm3Dpoint60 = scene.getObjectNormal("Front_Hotspot10");
   //    var hotspotopacity60 = infinityrt_dp(norm3Dpoint60, viewCameraZV) * hotspotopacityspeed - 2.98;
   //    if (hotspotopacity60 > 0 && (hotspotOn == true)) hotspotopacity60 = 0;
   //    if (hotspotopacity60 < 0.0) hotspotopacity60 = 0.0;
   //    else if (hotspotopacity60 > 1.0) hotspotopacity60 = 1.0;
   //    if (hotspotopacity60 == 0) $("#hotspot60", window.document).css('visibility', 'hidden');
   //    else $("#hotspot60", window.document).css('visibility', 'visible');
   //    pos2Dpoint60 = scene.projectPoint(scene.getObjectLocation("Front_Hotspot10", true)); 
   //    
   //      var pos2Dpoint61 = []; 
   //    var norm3Dpoint61 = scene.getObjectNormal("Front_Hotspot11");
   //    var hotspotopacity61 = infinityrt_dp(norm3Dpoint61, viewCameraZV) * hotspotopacityspeed - 2.98;
   //    if (hotspotopacity61 > 0 && (hotspotOn == true)) hotspotopacity61 = 0;
   //    if (hotspotopacity61 < 0.0) hotspotopacity61 = 0.0;
   //    else if (hotspotopacity61 > 1.0) hotspotopacity61 = 1.0;
   //    if (hotspotopacity61 == 0) $("#hotspot61", window.document).css('visibility', 'hidden');
   //    else $("#hotspot61", window.document).css('visibility', 'visible');
   //    pos2Dpoint61 = scene.projectPoint(scene.getObjectLocation("Front_Hotspot11", true));
   //    
   //          var pos2Dpoint62 = []; 
   //    var norm3Dpoint62 = scene.getObjectNormal("Front_Hotspot12");
   //    var hotspotopacity62 = infinityrt_dp(norm3Dpoint62, viewCameraZV) * hotspotopacityspeed - 2.98;
   //    if (hotspotopacity62 > 0 && (hotspotOn == true)) hotspotopacity62 = 0;
   //    if (hotspotopacity62 < 0.0) hotspotopacity62 = 0.0;
   //    else if (hotspotopacity62 > 1.0) hotspotopacity62 = 1.0;
   //    if (hotspotopacity62 == 0) $("#hotspot62", window.document).css('visibility', 'hidden');
   //    else $("#hotspot62", window.document).css('visibility', 'visible');
   //    pos2Dpoint62 = scene.projectPoint(scene.getObjectLocation("Front_Hotspot12", true));
   //
   //    //    //for new rear view end //
   //    

   //    
   var pos2Dpoint47 = [];
   var norm3Dpoint47 = scene.getObjectNormal("hotspot_8_SW_front_01");
   var hotspotopacity47 = infinityrt_dp(norm3Dpoint47,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity47 > 0 && (hotspotOn == true)) hotspotopacity47 = 0;
   if (hotspotopacity47 < 0.0) hotspotopacity47 = 0.0;
   else if (hotspotopacity47 > 1.0) hotspotopacity47 = 1.0;
   if (hotspotopacity47 == 0) $("#hotspot47",window.document).css('visibility','hidden');
   else $("#hotspot47",window.document).css('visibility','visible');
   pos2Dpoint47 = scene.projectPoint(scene.getObjectLocation("hotspot_8_SW_front_01",true));

   var pos2Dpoint48 = [];
   var norm3Dpoint48 = scene.getObjectNormal("hotspot_8_SW_front_02");
   var hotspotopacity48 = infinityrt_dp(norm3Dpoint48,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity48 > 0 && (hotspotOn == true)) hotspotopacity48 = 0;
   if (hotspotopacity48 < 0.0) hotspotopacity48 = 0.0;
   else if (hotspotopacity48 > 1.0) hotspotopacity48 = 1.0;
   if (hotspotopacity48 == 0) $("#hotspot48",window.document).css('visibility','hidden');
   else $("#hotspot48",window.document).css('visibility','visible');
   pos2Dpoint48 = scene.projectPoint(scene.getObjectLocation("hotspot_8_SW_front_02",true));

   var pos2Dpoint49 = [];
   var norm3Dpoint49 = scene.getObjectNormal("hotspot_8_SW_front_03");
   var hotspotopacity49 = infinityrt_dp(norm3Dpoint49,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity49 > 0 && (hotspotOn == true)) hotspotopacity49 = 0;
   if (hotspotopacity49 < 0.0) hotspotopacity49 = 0.0;
   else if (hotspotopacity49 > 1.0) hotspotopacity49 = 1.0;
   if (hotspotopacity49 == 0) $("#hotspot49",window.document).css('visibility','hidden');
   else $("#hotspot49",window.document).css('visibility','visible');
   pos2Dpoint49 = scene.projectPoint(scene.getObjectLocation("hotspot_8_SW_front_03",true));

   var pos2Dpoint50 = [];
   var norm3Dpoint50 = scene.getObjectNormal("hotspot_8_SW_front_04");
   var hotspotopacity50 = infinityrt_dp(norm3Dpoint50,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity50 > 0 && (hotspotOn == true)) hotspotopacity50 = 0;
   if (hotspotopacity50 < 0.0) hotspotopacity50 = 0.0;
   else if (hotspotopacity50 > 1.0) hotspotopacity50 = 1.0;
   if (hotspotopacity50 == 0) $("#hotspot50",window.document).css('visibility','hidden');
   else $("#hotspot49_1",window.document).css('visibility','visible');
   pos2Dpoint50 = scene.projectPoint(scene.getObjectLocation("hotspot_8_SW_front_04",true));


   var pos2Dpoint522 = [];
   var norm3Dpoint522 = scene.getObjectNormal("hotspot_SW_front_10");
   var hotspotopacity522 = infinityrt_dp(norm3Dpoint522,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity522 > 0 && (hotspotOn == true)) hotspotopacity522 = 0;
   if (hotspotopacity522 < 0.0) hotspotopacity522 = 0.0;
   else if (hotspotopacity522 > 1.0) hotspotopacity522 = 1.0;
   if (hotspotopacity522 == 0) $("#hotspot522",window.document).css('visibility','hidden');
   else $("#hotspot522",window.document).css('visibility','visible');
   pos2Dpoint522 = scene.projectPoint(scene.getObjectLocation("hotspot_SW_front_10",true));
   //    
   //    var pos2Dpoint51 = [];
   //    var norm3Dpoint51 = scene.getObjectNormal("Hotspot_21Shape-0");
   //    var hotspotopacity51 = infinityrt_dp(norm3Dpoint51, viewCameraZV) * hotspotopacityspeed - 2.98;
   //    if (hotspotopacity51 > 0 && (hotspotOn == true)) hotspotopacity51 = 0;
   //    if (hotspotopacity51 < 0.0) hotspotopacity51 = 0.0;
   //    else if (hotspotopacity51 > 1.0) hotspotopacity51 = 1.0;
   //    if (hotspotopacity51 == 0) $("#hotspot51", window.document).css('visibility', 'hidden');
   //    else $("#hotspot51", window.document).css('visibility', 'visible');
   //    pos2Dpoint51 = scene.projectPoint(scene.getObjectLocation("Hotspot_21Shape-0", true));
   //    
   //    var pos2Dpoint52 = [];
   //    var norm3Dpoint52 = scene.getObjectNormal("Hotspot_28Shape-0");
   //    var hotspotopacity52 = infinityrt_dp(norm3Dpoint52, viewCameraZV) * hotspotopacityspeed - 2.98;
   //    if (hotspotopacity52 > 0 && (hotspotOn == true)) hotspotopacity52 = 0;
   //    if (hotspotopacity52 < 0.0) hotspotopacity52 = 0.0;
   //    else if (hotspotopacity52 > 1.0) hotspotopacity52 = 1.0;
   //    if (hotspotopacity52 == 0) $("#hotspot52", window.document).css('visibility', 'hidden');
   //    else $("#hotspot52", window.document).css('visibility', 'visible');
   //    pos2Dpoint52 = scene.projectPoint(scene.getObjectLocation("Hotspot_28Shape-0", true));
   //
   var leftPosPoint1 = (pos2Dpoint1[0] * 50) + 50;
   var leftPosPoint2 = (pos2Dpoint2[0] * 50) + 50;
   var leftPosPoint3 = (pos2Dpoint3[0] * 50) + 50;
   var leftPosPoint4 = (pos2Dpoint4[0] * 50) + 50;
   var leftPosPoint5 = (pos2Dpoint5[0] * 50) + 50;
   var leftPosPoint6 = (pos2Dpoint6[0] * 50) + 50;
   var leftPosPoint7 = (pos2Dpoint7[0] * 50) + 50;
   var leftPosPoint8 = (pos2Dpoint8[0] * 50) + 50;
   var leftPosPoint9 = (pos2Dpoint9[0] * 50) + 50;
   var leftPosPoint10 = (pos2Dpoint10[0] * 50) + 50;
   var leftPosPoint11 = (pos2Dpoint11[0] * 50) + 50;
   var leftPosPoint12 = (pos2Dpoint12[0] * 50) + 50;
   var leftPosPoint13 = (pos2Dpoint13[0] * 50) + 50;
   var leftPosPoint14 = (pos2Dpoint14[0] * 50) + 50;
   var leftPosPoint15 = (pos2Dpoint15[0] * 50) + 50;
   var leftPosPoint16 = (pos2Dpoint16[0] * 50) + 50;
   var leftPosPoint17 = (pos2Dpoint17[0] * 50) + 50;
   var leftPosPoint18 = (pos2Dpoint18[0] * 50) + 50;
   var leftPosPoint19 = (pos2Dpoint19[0] * 50) + 50;
   var leftPosPoint20 = (pos2Dpoint20[0] * 50) + 50;
   var leftPosPoint21 = (pos2Dpoint21[0] * 50) + 50;
   var leftPosPoint22 = (pos2Dpoint22[0] * 50) + 50;
   var leftPosPoint23 = (pos2Dpoint23[0] * 50) + 50;
   var leftPosPoint24 = (pos2Dpoint24[0] * 50) + 50;
   var leftPosPoint019 = (pos2Dpoint019[0] * 50) + 50;
   var leftPosPoint020 = (pos2Dpoint020[0] * 50) + 50;
   var leftPosPoint021 = (pos2Dpoint021[0] * 50) + 50;
   var leftPosPoint022 = (pos2Dpoint022[0] * 50) + 50;
   var leftPosPoint023 = (pos2Dpoint023[0] * 50) + 50;
   var leftPosPoint024 = (pos2Dpoint024[0] * 50) + 50;
   //    var leftPosPoint25 = (pos2Dpoint25[0] * 50) + 50;
   var leftPosPoint26 = (pos2Dpoint26[0] * 50) + 50;
   var leftPosPoint27 = (pos2Dpoint27[0] * 50) + 50;
   var leftPosPoint28 = (pos2Dpoint28[0] * 50) + 50;
   var leftPosPoint29 = (pos2Dpoint29[0] * 50) + 50;
   var leftPosPoint30 = (pos2Dpoint30[0] * 50) + 50;
   //    var leftPosPoint31 = (pos2Dpoint31[0] * 50) + 50;
   //    var leftPosPoint32 = (pos2Dpoint32[0] * 50) + 50;
   //    var leftPosPoint33 = (pos2Dpoint33[0] * 50) + 50;
   //    var leftPosPoint34 = (pos2Dpoint34[0] * 50) + 50;
   //    var leftPosPoint35 = (pos2Dpoint35[0] * 50) + 50;
   //    var leftPosPoint36 = (pos2Dpoint36[0] * 50) + 50;
   //    var leftPosPoint50 = (pos2Dpoint50[0] * 50) + 50;
   ////   new callouts start 
   var leftPosPoint40 = (pos2Dpoint40[0] * 50) + 50;
   var leftPosPoint41 = (pos2Dpoint41[0] * 50) + 50;
   var leftPosPoint42 = (pos2Dpoint42[0] * 50) + 50;
   var leftPosPoint43 = (pos2Dpoint43[0] * 50) + 50;
   var leftPosPoint44 = (pos2Dpoint44[0] * 50) + 50;
   var leftPosPoint45 = (pos2Dpoint45[0] * 50) + 50;
   var leftPosPoint46 = (pos2Dpoint46[0] * 50) + 50;
   //    
   //    
   var leftPosPoint511 = (pos2Dpoint511[0] * 50) + 50;
   var leftPosPoint522 = (pos2Dpoint522[0] * 50) + 50;
   var leftPosPoint533 = (pos2Dpoint533[0] * 50) + 50;
   //    var leftPosPoint54 = (pos2Dpoint54[0] * 50) + 50;
   //    var leftPosPoint55 = (pos2Dpoint55[0] * 50) + 50;
   //    var leftPosPoint56 = (pos2Dpoint56[0] * 50) + 50;
   //    var leftPosPoint57 = (pos2Dpoint57[0] * 50) + 50;
   //    var leftPosPoint58 = (pos2Dpoint58[0] * 50) + 50;
   //    var leftPosPoint59 = (pos2Dpoint59[0] * 50) + 50;
   //    var leftPosPoint60 = (pos2Dpoint60[0] * 50) + 50;
   //    var leftPosPoint61 = (pos2Dpoint61[0] * 50) + 50;
   //    var leftPosPoint62 = (pos2Dpoint62[0] * 50) + 50;
   //   new callouts end 
   //    var leftPosPoint45 = (pos2Dpoint45[0] * 50) + 50;
   //    var leftPosPoint46 = (pos2Dpoint46[0] * 50) + 50;
   var leftPosPoint47 = (pos2Dpoint47[0] * 50) + 50;
   var leftPosPoint48 = (pos2Dpoint48[0] * 50) + 50;
   var leftPosPoint49 = (pos2Dpoint49[0] * 50) + 50;
   var leftPosPoint50 = (pos2Dpoint50[0] * 50) + 50;
   //    var leftPosPoint51 = (pos2Dpoint51[0] * 50) + 50;
   //    var leftPosPoint52 = (pos2Dpoint52[0] * 50) + 50;
   //    //    var leftPosPoint36 = (pos2Dpoint35[0] * 50) + 50;
   //
   var toptPosPoint1 = -((pos2Dpoint1[1] * 50) - 50);
   var toptPosPoint2 = -((pos2Dpoint2[1] * 50) - 50);
   var toptPosPoint3 = -((pos2Dpoint3[1] * 50) - 50);
   var toptPosPoint4 = -((pos2Dpoint4[1] * 50) - 50);
   var toptPosPoint5 = -((pos2Dpoint5[1] * 50) - 50);
   var toptPosPoint6 = -((pos2Dpoint6[1] * 50) - 50);
   var toptPosPoint7 = -((pos2Dpoint7[1] * 50) - 50);
   var toptPosPoint8 = -((pos2Dpoint8[1] * 50) - 50);
   var toptPosPoint9 = -((pos2Dpoint9[1] * 50) - 50);
   var toptPosPoint10 = -((pos2Dpoint10[1] * 50) - 50);
   var toptPosPoint11 = -((pos2Dpoint11[1] * 50) - 50);
   var toptPosPoint12 = -((pos2Dpoint12[1] * 50) - 50);
   var toptPosPoint13 = -((pos2Dpoint13[1] * 50) - 50);
   var toptPosPoint14 = -((pos2Dpoint14[1] * 50) - 50);
   var toptPosPoint15 = -((pos2Dpoint15[1] * 50) - 50);
   var toptPosPoint16 = -((pos2Dpoint16[1] * 50) - 50);
   var toptPosPoint17 = -((pos2Dpoint17[1] * 50) - 50);
   var toptPosPoint18 = -((pos2Dpoint18[1] * 50) - 50);
   var toptPosPoint19 = -((pos2Dpoint19[1] * 50) - 50);
   var toptPosPoint20 = -((pos2Dpoint20[1] * 50) - 50);
   var toptPosPoint21 = -((pos2Dpoint21[1] * 50) - 50);
   var toptPosPoint22 = -((pos2Dpoint22[1] * 50) - 50);
   var toptPosPoint23 = -((pos2Dpoint23[1] * 50) - 50);
   var toptPosPoint24 = -((pos2Dpoint24[1] * 50) - 50);
   var toptPosPoint019 = -((pos2Dpoint019[1] * 50) - 50);
   var toptPosPoint020 = -((pos2Dpoint020[1] * 50) - 50);
   var toptPosPoint021 = -((pos2Dpoint021[1] * 50) - 50);
   var toptPosPoint022 = -((pos2Dpoint022[1] * 50) - 50);
   var toptPosPoint023 = -((pos2Dpoint023[1] * 50) - 50);
   var toptPosPoint024 = -((pos2Dpoint024[1] * 50) - 50);
   //    var toptPosPoint25 = -((pos2Dpoint25[1] * 50) - 50);
   var toptPosPoint26 = -((pos2Dpoint26[1] * 50) - 50);
   var toptPosPoint27 = -((pos2Dpoint27[1] * 50) - 50);
   var toptPosPoint28 = -((pos2Dpoint28[1] * 50) - 50);
   var toptPosPoint29 = -((pos2Dpoint29[1] * 50) - 50);
   var toptPosPoint30 = -((pos2Dpoint30[1] * 50) - 50);
   //    var toptPosPoint31 = -((pos2Dpoint31[1] * 50) - 50);
   //    var toptPosPoint32 = -((pos2Dpoint32[1] * 50) - 50);
   //    var toptPosPoint33 = -((pos2Dpoint33[1] * 50) - 50);
   //    var toptPosPoint34 = -((pos2Dpoint34[1] * 50) - 50);
   //    var toptPosPoint35 = -((pos2Dpoint35[1] * 50) - 50);
   //    var toptPosPoint36 = -((pos2Dpoint36[1] * 50) - 50);
   //    var toptPosPoint50 = -((pos2Dpoint50[1] * 50) - 50);
   ////    Callouts Start
   var toptPosPoint40 = -((pos2Dpoint40[1] * 50) - 50);
   var toptPosPoint41 = -((pos2Dpoint41[1] * 50) - 50);
   var toptPosPoint42 = -((pos2Dpoint42[1] * 50) - 50);
   var toptPosPoint43 = -((pos2Dpoint43[1] * 50) - 50);
   var toptPosPoint44 = -((pos2Dpoint44[1] * 50) - 50);
   var toptPosPoint45 = -((pos2Dpoint45[1] * 50) - 50);
   var toptPosPoint46 = -((pos2Dpoint46[1] * 50) - 50);
   //    
   //    
   var toptPosPoint511 = -((pos2Dpoint511[1] * 50) - 50);
   var toptPosPoint522 = -((pos2Dpoint522[1] * 50) - 50);
   var toptPosPoint533 = -((pos2Dpoint533[1] * 50) - 50);
   //    var toptPosPoint54 = -((pos2Dpoint54[1] * 50) - 50);
   //    var toptPosPoint55 = -((pos2Dpoint55[1] * 50) - 50);
   //    var toptPosPoint56 = -((pos2Dpoint56[1] * 50) - 50);
   //    var toptPosPoint57 = -((pos2Dpoint57[1] * 50) - 50);
   //    var toptPosPoint58 = -((pos2Dpoint58[1] * 50) - 50);
   //    var toptPosPoint59 = -((pos2Dpoint59[1] * 50) - 50);
   //    var toptPosPoint60 = -((pos2Dpoint60[1] * 50) - 50);
   //    var toptPosPoint61 = -((pos2Dpoint61[1] * 50) - 50);
   //    var toptPosPoint62 = -((pos2Dpoint62[1] * 50) - 50);
   //    Callouts end
   //    var toptPosPoint45 = -((pos2Dpoint45[1] * 50) - 50);
   //    var toptPosPoint46 = -((pos2Dpoint46[1] * 50) - 50);
   var toptPosPoint47 = -((pos2Dpoint47[1] * 50) - 50);
   var toptPosPoint48 = -((pos2Dpoint48[1] * 50) - 50);
   var toptPosPoint49 = -((pos2Dpoint49[1] * 50) - 50);
   var toptPosPoint50 = -((pos2Dpoint50[1] * 50) - 50);
   //	    var toptPosPoint511 = -((pos2Dpoint511[1] * 50) - 50);
   //    var toptPosPoint52 = -((pos2Dpoint52[1] * 50) - 50);
   //    //    var toptPosPoint36 = -((pos2Dpoint35[1] * 50) - 50);
   //
   $("#hotspot1").css('left',leftPosPoint1 + '%').css('top',toptPosPoint1 + '%');
   $("#hotspot2").css('left',leftPosPoint2 + '%').css('top',toptPosPoint2 + '%');
   $("#hotspot3").css('left',leftPosPoint3 + '%').css('top',toptPosPoint3 + '%');
   $("#hotspot4").css('left',leftPosPoint4 + '%').css('top',toptPosPoint4 + '%');
   $("#hotspot5").css('left',leftPosPoint5 + '%').css('top',toptPosPoint5 + '%');
   $("#hotspot6").css('left',leftPosPoint6 + '%').css('top',toptPosPoint6 + '%');
   $("#hotspot7").css('left',leftPosPoint7 + '%').css('top',toptPosPoint7 + '%');
   $("#hotspot8").css('left',leftPosPoint8 + '%').css('top',toptPosPoint8 + '%');
   $("#hotspot9").css('left',leftPosPoint9 + '%').css('top',toptPosPoint9 + '%');
   $("#hotspot10").css('left',leftPosPoint10 + '%').css('top',toptPosPoint10 + '%');
   $("#hotspot11").css('left',leftPosPoint11 + '%').css('top',toptPosPoint11 + '%');
   $("#hotspot12").css('left',leftPosPoint12 + '%').css('top',toptPosPoint12 + '%');
   $("#hotspot13").css('left',leftPosPoint13 + '%').css('top',toptPosPoint13 + '%');
   $("#hotspot14").css('left',leftPosPoint14 + '%').css('top',toptPosPoint14 + '%');
   $("#hotspot15").css('left',leftPosPoint15 + '%').css('top',toptPosPoint15 + '%');
   $("#hotspot16").css('left',leftPosPoint16 + '%').css('top',toptPosPoint16 + '%');
   $("#hotspot17").css('left',leftPosPoint17 + '%').css('top',toptPosPoint17 + '%');
   $("#hotspot18").css('left',leftPosPoint18 + '%').css('top',toptPosPoint18 + '%');
   $("#hotspot19").css('left',leftPosPoint19 + '%').css('top',toptPosPoint19 + '%');
   $("#hotspot20").css('left',leftPosPoint20 + '%').css('top',toptPosPoint20 + '%');
   $("#hotspot21").css('left',leftPosPoint21 + '%').css('top',toptPosPoint21 + '%');
   $("#hotspot22").css('left',leftPosPoint22 + '%').css('top',toptPosPoint22 + '%');
   $("#hotspot23").css('left',leftPosPoint23 + '%').css('top',toptPosPoint23 + '%');
   $("#hotspot24").css('left',leftPosPoint24 + '%').css('top',toptPosPoint24 + '%');
   $("#hotspot019").css('left',leftPosPoint019 + '%').css('top',toptPosPoint019 + '%');
   $("#hotspot020").css('left',leftPosPoint020 + '%').css('top',toptPosPoint020 + '%');
   $("#hotspot021").css('left',leftPosPoint021 + '%').css('top',toptPosPoint021 + '%');
   $("#hotspot022").css('left',leftPosPoint022 + '%').css('top',toptPosPoint022 + '%');
   $("#hotspot023").css('left',leftPosPoint023 + '%').css('top',toptPosPoint023 + '%');
   $("#hotspot024").css('left',leftPosPoint024 + '%').css('top',toptPosPoint024 + '%');
   //    $("#hotspot25").css('left', leftPosPoint25 + '%').css('top', toptPosPoint25 + '%');
   $("#hotspot26").css('left',leftPosPoint26 + '%').css('top',toptPosPoint26 + '%');
   $("#hotspot27").css('left',leftPosPoint27 + '%').css('top',toptPosPoint27 + '%');
   $("#hotspot28").css('left',leftPosPoint28 + '%').css('top',toptPosPoint28 + '%');
   $("#hotspot29").css('left',leftPosPoint29 + '%').css('top',toptPosPoint29 + '%');
   $("#hotspot30").css('left',leftPosPoint30 + '%').css('top',toptPosPoint30 + '%');
   //    $("#hotspot31").css('left', leftPosPoint31 + '%').css('top', toptPosPoint31 + '%');
   //    $("#hotspot32").css('left', leftPosPoint32 + '%').css('top', toptPosPoint32 + '%');
   //    $("#hotspot33").css('left', leftPosPoint33 + '%').css('top', toptPosPoint33 + '%');
   //    $("#hotspot34").css('left', leftPosPoint34 + '%').css('top', toptPosPoint34 + '%');
   //    $("#hotspot35").css('left', leftPosPoint35 + '%').css('top', toptPosPoint35 + '%');
   //    $("#hotspot36").css('left', leftPosPoint36 + '%').css('top', toptPosPoint36 + '%');
   //    $("#hotspot50").css('left', leftPosPoint50 + '%').css('top', toptPosPoint50 + '%');
   //    Callouts Start
   $("#hotspot40").css('left',leftPosPoint40 + '%').css('top',toptPosPoint40 + '%');
   $("#hotspot41").css('left',leftPosPoint41 + '%').css('top',toptPosPoint41 + '%');
   $("#hotspot42").css('left',leftPosPoint42 + '%').css('top',toptPosPoint42 + '%');
   $("#hotspot43").css('left',leftPosPoint43 + '%').css('top',toptPosPoint43 + '%');
   $("#hotspot44").css('left',leftPosPoint44 + '%').css('top',toptPosPoint44 + '%');
   $("#hotspot45").css('left',leftPosPoint45 + '%').css('top',toptPosPoint45 + '%');
   $("#hotspot46").css('left',leftPosPoint46 + '%').css('top',toptPosPoint46 + '%');

   //    
   $("#hotspot511").css('left',leftPosPoint511 + '%').css('top',toptPosPoint511 + '%');
   $("#hotspot522").css('left',leftPosPoint522 + '%').css('top',toptPosPoint522 + '%');
   $("#hotspot533").css('left',leftPosPoint533 + '%').css('top',toptPosPoint533 + '%');
   //    $("#hotspot54").css('left', leftPosPoint54 + '%').css('top', toptPosPoint54 + '%');
   //    $("#hotspot55").css('left', leftPosPoint55 + '%').css('top', toptPosPoint55 + '%');
   //    $("#hotspot56").css('left', leftPosPoint56 + '%').css('top', toptPosPoint56 + '%');
   //    $("#hotspot57").css('left', leftPosPoint57 + '%').css('top', toptPosPoint57 + '%');
   //    $("#hotspot58").css('left', leftPosPoint58 + '%').css('top', toptPosPoint58 + '%');
   //    $("#hotspot59").css('left', leftPosPoint59 + '%').css('top', toptPosPoint59 + '%');
   //    $("#hotspot60").css('left', leftPosPoint60 + '%').css('top', toptPosPoint60 + '%');
   //    $("#hotspot61").css('left', leftPosPoint61 + '%').css('top', toptPosPoint61 + '%');
   //    $("#hotspot62").css('left', leftPosPoint62 + '%').css('top', toptPosPoint62 + '%');
   //    Callouts End 
   //    $("#hotspot45").css('left', leftPosPoint45 + '%').css('top', toptPosPoint45 + '%');
   //    $("#hotspot46").css('left', leftPosPoint46 + '%').css('top', toptPosPoint46 + '%');
   $("#hotspot47").css('left',leftPosPoint47 + '%').css('top',toptPosPoint47 + '%');
   $("#hotspot48").css('left',leftPosPoint48 + '%').css('top',toptPosPoint48 + '%');
   $("#hotspot49").css('left',leftPosPoint49 + '%').css('top',toptPosPoint49 + '%');
   $("#hotspot50").css('left',leftPosPoint50 + '%').css('top',toptPosPoint50 + '%');
   //    $("#hotspot51").css('left', leftPosPoint51 + '%').css('top', toptPosPoint51 + '%');
   //    $("#hotspot52").css('left', leftPosPoint52 + '%').css('top', toptPosPoint52 + '%');
   //    //    $("#hotspot36").css('left', leftPosPoint35 + '%').css('top', toptPosPoint35 + '%');
   //    //
   if (Math.floor(sceneViewMatrix[5]) == 0) {
      clockWise = false;
   } else if (Math.floor(sceneViewMatrix[5]) == -1) {
      clockWise = true;
   }
}
var mpos = [0,0];
var mdown = false;
var panNav = false;
var prevAnimation = null;

function mouseDown(ev) {
   if (!animStoped) return;
   $("#onloadCopy").css("opacity","0");
   $("#rightAnim").animate({
      right: '-235px'
   },"slow");
   rightAnimToggle = true;
   mouseDownHide();
   for (var i = 0; i < timeouts.length; i++) {
      clearTimeout(timeouts[i]);
   }
   // CalloutsHide();
   hideAll();
   objectHide()
   CalloutsHide();
   hideCallouts();
   autoRotateStop();
   clearTimeout(autoPlayInt)
   clearInterval(autoRotateInterval);
   clearTimeout(myVar);
   clearTimeout(startAutorot);
   for (var i = 0; i < timeoutsnew.length; i++) {
      clearTimeout(timeoutsnew[i]);
   }
   timeouts = [];
   timeoutsnew = [];
   //	for (var j = 1; j <= 13; j++) {
   //		if (j == 3 || j == 6 || j == 7 || j == 8) {} else {
   //			translateOut(j);
   //		}
   //	}
   //		for (var j = 1; j <= 15; j++) {if(j ==5 || j ==3 || j ==4 || j ==6 || j ==7 ||j ==8 ||j ==9 ||j ==10){}else{translateOut(j);}}  
   if (autoplayAnim) autoPauseAllAnimations();
   var s = getScene(ev);
   if (ev.which == 3) {
      panNav = true;
   }
   var mouseDownPos = [ev.clientX - canvas.offsetLeft,ev.clientY - canvas.offsetTop];
   if (!s.onClick(mouseDownPos,ev.button)) {
      mdown = true;
      mpos = mouseDownPos;
   }
}

function mouseUp(ev) {
   mdown = false;
   if (ev.which == 3 || panNav) panNav = false;
   handOpen();
}

function mouseOut(ev) {
   mdown = false;
   if (ev.which == 3 || panNav) panNav = false;
   handOpen();
}

function mouseMove(ev) {
   if (!mdown || !animStoped) return;
   for (var i = 0; i < timeouts.length; i++) {
      clearTimeout(timeouts[i]);
   }
   timeouts = [];
   clearInterval(autoRotateInterval);
   clearTimeout(myVar);
   var s = getScene(ev);
   var mousePos = [ev.clientX - canvas.offsetLeft,ev.clientY - canvas.offsetTop];
   var mdelta = [(mpos[0] - mousePos[0]),(mpos[1] - mousePos[1])];
   mpos = [mousePos[0],mousePos[1]];
   //pan nav is initialized and set in ui\_ui.js for now.
   if (!panNav) {
      if (s._nav.NavRotation(mpos,mdelta)) s.clearRefine();
   } else {
      var mdelta2 = [mdelta[0] * 3,mdelta[1] * 3];
      if (s._nav.NavPan(mdelta2)) s.clearRefine();
   }
}

function mouseWheel(ev) {
   if (!animStoped) return;
   $("#rightAnim").animate({
      right: '-235px'
   },"slow");
   rightAnimToggle = true;
   for (var i = 0; i < timeouts.length; i++) {
      clearTimeout(timeouts[i]);
   }
   timeouts = [];
   clearTimeout(autoPlayInt);
   clearInterval(autoRotateInterval);
   clearTimeout(myVar);
   autoRotateStop();
   clearTimeout(startAutorot);
   //	for (var j = 1; j <= 15; j++) {
   //		translateOut(j);
   //	}

   hideAll();
   objectHide()
   CalloutsHide();
   hideCallouts();
   if (autoplayAnim) autoPauseAllAnimations();
   var s = getScene(ev);
   var delta = ev.wheelDelta ? ev.wheelDelta : (-ev.detail * 10.0);
   //var deltaScene = (delta*0.05)*(scene.sceneRadius*0.01);
   var deltaScene = delta * 0.06;
   if (s._nav.NavChangeDolly(deltaScene)) s.clearRefine();
}

function hideAll() { }

function updateZoomBarBg(newval) {
   var scale = -(navMinDolly - navMaxDolly);
   var val = -newval + navMaxDolly;
   $("#zoom_slider_bg").css("height",(val / scale) * 100 + "%");
}

function updateZoomBar(newval) {
   var scale = -(navMinDolly - navMaxDolly);
   var val = -newval;
   $(".ui-slider-handle").css("bottom",(val / scale) * 100 + "%");
}
//var animStoped = true;
//function animComplete() {
////    animStoped = true;
//    g_navEnabled = true;
//}
var animStoped = true;
var dragCursor;
var curBrowser = BrowserDetect.browser;
// IE doesn't support co-ordinates
var cursCoords = (curBrowser == "Explorer") ? "" : " 4 4";

function initDragCursor() {
   handOpen();
   $('#sliderBG').mousedown(function () {
      handClosed();
   });
   $('.ui-slider-handle').mousedown(function () {
      handClosed();
   });
   $('body').mouseup(function () {
      handOpen();
   });
   $('body').mouseup(function () {
      handOpen();
   });
}

function handClosed() {
   dragCursor = (curBrowser == "Firefox") ? "-moz-grabbing" : "url(images_gl/closedhand.cur)" + cursCoords + ", move";
   // Opera doesn't support url cursors and doesn't fall back well...
   if (curBrowser == "Opera") dragCursor = "move";
   $('.ui-slider-handle').css("cursor",dragCursor);
   $('#sliderBG').css("cursor",dragCursor);
   $('#dummy-canvas').css("cursor",dragCursor);
}

function handOpen() {
   dragCursor = (curBrowser == "Firefox") ? "-moz-grab" : "url(images_gl/openhand.cur)" + cursCoords + ", move";
   $('.ui-slider-handle').css("cursor",dragCursor);
   $('#sliderBG').css("cursor",dragCursor);
   $('#dummy-canvas').css("cursor",dragCursor);
}

var mouseIsDown = false;
var loopCtr = 0;
var touch = new Vector3();
var touches = [new Vector3(),new Vector3(),new Vector3()];
var prevTouches = [new Vector3(),new Vector3(),new Vector3()];
var prevDistance = null;
var startAutorot;

function touchStart(event) {
   for (var j = 1; j <= 13; j++) {
      if (j == 2 || j == 7) { } else {
         translateOut(j);
      }
   }
   if (!animStoped) return;
   mdown = true;
   autoPauseAllAnimations();
   autoRotateStop();
   clearInterval(autoRotateInterval);
   clearTimeout(myVar);
   clearTimeout(startAutorot);
   reversAll();
   switch (event.touches.length) {
      case 1:
         touches[0].set(event.touches[0].pageX,event.touches[0].pageY,0);
         touches[1].set(event.touches[0].pageX,event.touches[0].pageY,0);
         break;
      case 2:
         for (var j = 1; j <= 15; j++) {
            translateOut(j);
         }
         touches[0].set(event.touches[0].pageX,event.touches[0].pageY,0);
         touches[1].set(event.touches[1].pageX,event.touches[1].pageY,0);
         prevDistance = touches[0].distanceTo(touches[1]);
         break;
   }
   prevTouches[0].copy(touches[0]);
   prevTouches[1].copy(touches[1]);
}
var doubleTouch = false;

function touchMove(event) {
   //      if(menu11wasclicked==true){
   //		
   //	} 
   //	else{
   //		for (var j = 1; j <= 15; j++) {if(j ==5 || j ==3 || j ==4 || j ==6 || j ==7 || j ==11 ||j ==8 ||j ==9 ||j ==10){}else{translateOut(j);}}
   //	}
   if (!animStoped || !mdown) return;
   autoPauseAllAnimations();
   for (var j = 1; j <= 13; j++) {
      if (j == 2 || j == 7) { } else {
         translateOut(j);
      }
   }
   clearInterval(autoRotateInterval);
   clearTimeout(myVar);
   clearTimeout(startAutorot);
   var s = getScene(event);
   event.preventDefault();
   event.stopPropagation();
   var getClosest = function (touch,touches) {
      var closest = touches[0];
      for (var i in touches) {
         if (closest.distanceTo(touch) > touches[i].distanceTo(touch)) closest = touches[i];
      }
      return closest;
   }
   switch (event.touches.length) {
      case 1:
         if (doubleTouch == false) {
            clearInterval(autoRotateInterval);
            clearTimeout(myVar);
            touches[0].set(event.touches[0].pageX,event.touches[0].pageY,0);
            touches[1].set(event.touches[0].pageX,event.touches[0].pageY,0);
            if (s._nav.NavRotation([touches[0].x,touches[0].y],[(prevTouches[0].x - touches[0].x) * 1.5,(prevTouches[0].y - touches[0].y) * 1.5])) s.clearRefine();
            //scope.rotate( touches[ 0 ].sub( getClosest( touches[ 0 ] ,prevTouches ) ).multiplyScalar( - 0.005 ) );
         }
         break;
      case 2:
         //					$("#pointtext3").fadeOut(0);
         //                    $("#pointtext6").fadeOut(0);
         //                    $("#pointtext1").fadeOut(0);
         doubleTouch = true;
         //alert("double");
         clearInterval(autoRotateInterval);
         clearTimeout(myVar);
         touches[0].set(event.touches[0].pageX,event.touches[0].pageY,0);
         touches[1].set(event.touches[1].pageX,event.touches[1].pageY,0);
         distance = touches[0].distanceTo(touches[1]);
         var deltaScene = -(prevDistance - distance) * 3;
         if (s._nav.NavChangeDolly(deltaScene)) {
            s.clearRefine();
         }
         //scope.zoom( new Vector3( 0, 0, prevDistance - distance ) );
         prevDistance = distance;
         var offset0 = touches[0].clone().sub(getClosest(touches[0],prevTouches));
         var offset1 = touches[1].clone().sub(getClosest(touches[1],prevTouches));
         offset0.x = -offset0.x;
         offset1.x = -offset1.x;
         var mdelta2 = [offset1.x * 10,-offset1.y * 10];
         if (s._nav.NavPan(mdelta2)) s.clearRefine();
         //scope.pan( offset0.add( offset1 ).multiplyScalar( 0.5 ) );
         break;
   }
   prevTouches[0].copy(touches[0]);
   prevTouches[1].copy(touches[1]);
}

function touchEndCan(event) {
   mdown = false;
   setTimeout(function () {
      doubleTouch = false;
   },100);
}

function parseXml() {
   //console.log("fn call in ");
   $.ajax({
      url: 'text.xml', // name of file you want to parse
      dataType: "xml", // type of file you are trying to read
      success: function parse(document) {
         $(document).find("loader").each(function () {
            /*var loaderHeading = $(this).find('loaderHeading').text();
            $('.loaderheading').append(loaderHeading);*/
            var subheading = $(this).find('subheading').text();
            $('.subheading').append(subheading);
            var greyLeftTop = $(this).find('greyLeftTop').text();
            $('.grey-left-top').append(greyLeftTop);
            var greyLeftBottom = $(this).find('greyLeftBottom').text();
            $('.grey-left-bottom').prepend(greyLeftBottom);
            var greyRightTop = $(this).find('greyRightTop').text();
            $('.grey-right-top').append(greyRightTop);
            var greyRightBottom = $(this).find('greyRightBottom').text();
            $('.grey-right-bottom').append(greyRightBottom);
            var loaderOpen = $(this).find('loaderOpen').text();
            $('.loader-open').append(loaderOpen);
            var loaderZoom = $(this).find('loaderZoom').text();
            $('.loader-zoom').append(loaderZoom);
            var loaderRotate = $(this).find('loaderRotate').text();
            $('.loader-rotate').append(loaderRotate);
            var loaderMove = $(this).find('loaderMove').text();
            $('.loader-move').append(loaderMove);
            var leftMouse = $(this).find('leftMouse').text();
            $('.left-mouse').prepend(leftMouse);
            var rotateMouse = $(this).find('rotateMouse').text();
            $('.rotate-mouse').append(rotateMouse);
            var scrollMouse = $(this).find('scrollMouse').text();
            $('.scroll-mouse').prepend(scrollMouse);
            var zoomMouse = $(this).find('zoomMouse').text();
            $('.zoom').append(zoomMouse);
            var bothMouse = $(this).find('bothMouse').text();
            $('.both-mouse').prepend(bothMouse);
            var pan = $(this).find('pan').text();
            $('.pan-mouse').append(pan);
         });
         //             $(document).find("message").each(function(){
         //             	var blackPatch = $(this).find('blackPatch').text();
         //             	$('.productName span').append(blackPatch);  
         //             	var cpText = $(this).find('#onloadCopy').text();
         //             	$('#onloadCopy').append(cpText);
         //             	var cpHeading = $(this).find('cpHeading').text();
         //             	$('#cpHeading').append(cpHeading);
         //                 var cpSubHeading = $(this).find('cpSubHeading').text();
         //             	$('#cpSubHeading').append(cpSubHeading);
         //   
         //                    
         //                 
         //             });
         $(document).find("onloadCopy").each(function () {
            var point1_1 = $(this).find('point1text1').text();
            $('#onloadCopy p:nth-child(1)').append(point1_1);
         });
         $(document).find("buttons").each(function () {
            var backText = $(this).find('backText').text();
            $('#backText').append(backText);
            var zoomText = $(this).find('zoomText').text();
            $('#zoomText').append(zoomText);
            var roatateText = $(this).find('roatateText').text();
            $('#roatateText').append(roatateText);
            var moveText = $(this).find('moveText').text();
            $('#moveText').append(moveText);
            btnOpen = $(this).find('divOpen').text();
            $('#openCloseDiv').html(btnOpen);
            btnClose = $(this).find('divClose').text();
            //$('#openCloseDiv').append(btnClose);
         });
         $(document).find("pointtext1").each(function () {
            var point1_1 = $(this).find('point1text1').text();
            $('#pointtext1 #Cp_text_01').append(point1_1);
            var point1_2 = $(this).find('point1text2').text();
            $('#pointtext1 #Cp_text_02').append(point1_2);
            var point1_3 = $(this).find('point1text3').text();
            $('#pointtext1 #Cp_text_03').append(point1_3);
            var point1_4 = $(this).find('point1text4').text();
            $('#pointtext1 #Cp_text_04').append(point1_4);
            var point1_5 = $(this).find('point1text5').text();
            $('#pointtext1 #Cp_text_05').append(point1_5);
            var point1_6 = $(this).find('point1text6').text();
            $('#pointtext1 #Cp_text_06').append(point1_6);
            var point1_7 = $(this).find('point1text7').text();
            $('#pointtext1 #Cp_text_07').append(point1_7);
            var point1_8 = $(this).find('point1text8').text();
            $('#pointtext1 #Cp_text_08').append(point1_8);
            var point1_9 = $(this).find('point1text9').text();
            $('#pointtext1 #Cp_text_09').append(point1_9);
            var point1_10 = $(this).find('point1text10').text();
            $('#pointtext1 #Cp_text_10').append(point1_10);
            var point1_11 = $(this).find('point1text11').text();
            $('#pointtext1 #Cp_text_11').append(point1_11);
            var point1_12 = $(this).find('point1text12').text();
            $('#pointtext1 #Cp_text_12').append(point1_12);
            var point1_13 = $(this).find('point1text13').text();
            $('#pointtext1 .Cp_textul li:nth-child(1)').html(point1_13);
            var point1_14 = $(this).find('point1text14').text();
            $('#pointtext1 .Cp_textul li:nth-child(2)').html(point1_14);
            var point1_15 = $(this).find('point1text15').text();
            $('#pointtext1 .Cp_textul li:nth-child(3)').html(point1_15);
            var point1_16 = $(this).find('point1text16').text();
            $('#pointtext1 .Cp_textul li:nth-child(4)').html(point1_16);
         });
         //
         //            $(document).find("point2text").each(function () {
         //
         //            });
         $(document).find("point3text").each(function () {
            var point3_1 = $(this).find('headingText').text();
            $('#point3text .point3headingText').append(point3_1);
            var point3_2 = $(this).find('point3text1').text();
            $('#point3text #hot1').append(point3_2);
            var point3_3 = $(this).find('point3text2').text();
            $('#point3text #hot2').append(point3_3);
            //                 var point3_4 = $(this).find('point3text3').text();
            //                $('#point3text #hot10').append(point3_4);
            //                
            //                 var point3_5 = $(this).find('point3text4').text();
            //                $('#point3text #hot11').append(point3_5);
            //                
            //                var point3_6 = $(this).find('point3textHeading').text();
            //                $('#point3text #point3textHeading').append(point3_6);
         });
         $(document).find("point4text").each(function () {
            var point4_0 = $(this).find('point4heading').text();
            $('.point4headingText').append(point4_0);
            var point4_1 = $(this).find('point4text1').text();
            $('#point4text #hot3').append(point4_1);
            var point4_2 = $(this).find('point4text2').text();
            $('#point4text #hot4').append(point4_2);
            var point4_3 = $(this).find('point4text3').text();
            $('#point4text #hot5').append(point4_3);
            var point4_4 = $(this).find('point4text4').text();
            $('#point4text #hot6').append(point4_4);
            var point4_5 = $(this).find('point4text5').text();
            $('#point4text #hot7').append(point4_5);
            var point4_6 = $(this).find('point4text6').text();
            $('#point4text #hot8').append(point4_6);
            var point4_7 = $(this).find('point4text7').text();
            $('#point4text #hot9').append(point4_7);
            var point4_5 = $(this).find('point4text5').text();
            $('#point4text .point4text1').append(point4_5);
         });
         //            $(document).find("point5text").each(function () {
         //                var point5_0 = $(this).find('point5heading').text();
         //                $('.point5headingText').append(point5_0);
         //                var point5_1 = $(this).find('point5text1').text();
         //                $('#point5text .point5text1').append(point5_1);
         //                var point5_2 = $(this).find('point5text2').text();
         //                $('#point5text .point5text2').append(point5_2);
         //                var point5_3 = $(this).find('point5text3').text();
         //                $('#point5text .point5text3').append(point5_3);
         //                var point5_4 = $(this).find('point5text4').text();
         //                $('#point5text .point5text4').append(point5_4);
         //                var point5_5 = $(this).find('point5text5').text();
         //                $('#point5text .point5text5').append(point5_5);
         //                var point5_6 = $(this).find('point5text6').text();
         //                $('#point5text .point5text6').append(point5_6);
         //            });

         $(document).find("point34text").each(function () {
            var point34_1 = $(this).find('point34heading').text();
            $('.point34headingText').append(point34_1);

            var point34_2 = $(this).find('point34text1').text();
            $('#point34text #hot019').append(point34_2);
            var point34_3 = $(this).find('point34text2').text();
            $('#point34text #hot020').append(point34_3);
            var point34_4 = $(this).find('point34text3').text();
            $('#point34text #hot021').append(point34_4);
            var point34_6 = $(this).find('point34text4').text();
            $('#point34text #hot022').append(point34_6);
            var point34_7 = $(this).find('point34text5').text();
            $('#point34text #hot023').append(point34_7);
            var point34_8 = $(this).find('point34text6').text();
            $('#point34text #hot024').append(point34_8);
         });
         $(document).find("point6text").each(function () {
            var point6_11 = $(this).find('point6heading').text();
            $('.point6headingText').append(point6_11);
            var point6_1 = $(this).find('point6text1').text();
            $('.point6text1').html(point6_1);
            var point6_2 = $(this).find('point6text2').text();
            $('.point6text2').html(point6_2);
            var point6_3 = $(this).find('point6text3').text();
            $('.point6text3').html(point6_3);
            var point6_4 = $(this).find('point6text4').text();
            $('.point6text4').html(point6_4);
            var point6_5 = $(this).find('point6text5').text();
            $('.point6text5').html(point6_5);
            var point6_7 = $(this).find('point6text7').text();
            $('.point6text7').html(point6_7);
            var point6_8 = $(this).find('point6text8').text();
            $('.point6text8').html(point6_8);
            var point6_9 = $(this).find('point6text9').text();
            $('.point6text9').html(point6_9);
            //
            ////                var point6_7 = $(this).find('point6text7').text();
            ////                $('#hot17').html(point6_7);
            ////
            ////                var point6_8 = $(this).find('point6text8').text();
            ////                $('#hot18').html(point6_8);
            //
            //                var point6_9 = $(this).find('point6text9').text();
            //                $('#hot19').html(point6_9);
            //
            //                var point6_10 = $(this).find('point6text10').text();
            //                $('#hot20').html(point6_10);
            //
            //                var point6_11 = $(this).find('point6text11').text();
            //                $('#hot21').html(point6_11);
         });
         $(document).find("point5text").each(function () {
            var point5_11 = $(this).find('point5heading').text();
            $('.point5headingText').append(point5_11);
            //				var point5_1 = $(this).find('point5text1').text();
            //				$('#hot40').html(point5_1);
            //				var point5_2 = $(this).find('point5text2').text();
            //				$('#hot41').html(point5_2);
            //				var point5_3 = $(this).find('point5text3').text();
            //				$('#hot42').html(point5_3);
            //				var point5_4 = $(this).find('point5text4').text();
            //				$('#hot43').html(point5_4);
            //				var point5_5 = $(this).find('point5text5').text();
            //				$('#hot44').html(point5_5);
            //                var point5_6 = $(this).find('point5text6').text();
            //                $('#hot45').html(point5_6);
            //
            //                var point5_7 = $(this).find('point5text7').text();
            //                $('#hot46').html(point5_7);
            //
            //                var point5_8 = $(this).find('point5text8').text();
            //                $('#hot47').html(point5_8);
            //
            //                var point5_9 = $(this).find('point5text9').text();
            //                $('#hot48').html(point5_9);
            //
            //                var point5_10 = $(this).find('point5text10').text();
            //                $('#hot49').html(point5_10);
            //
            //                var point5_12 = $(this).find('point5text12').text();
            //                $('#hot51').html(point5_12);
            //                 var point5_13 = $(this).find('point5text13').text();
            //                $('#hot52').html(point5_13);
         });
         $(document).find("point7text").each(function () {
            var point7_1 = $(this).find('point7headingText').text();
            $('.point7headingText').append(point7_1);
            var point7_2 = $(this).find('point7text1').text();
            $('#point7text .point7text1').append(point7_2);
            var point7_3 = $(this).find('point7text2').text();
            //                $('#hot23').append(point7_3);
            //                var point7_4 = $(this).find('point7text3').text();
            //                $('#hot24').append(point7_4);
            //                var point7_5 = $(this).find('point7text4').text();
            //                $('#hot25').append(point7_5);
            //                var point7_6 = $(this).find('point7text5').text();
            //                $('#hot26').append(point7_6);
            //                var point7_7 = $(this).find('point7text6').text();
            //                $('#hot27').append(point7_7);
            //                var point7_8 = $(this).find('point7text7').text();
            //                $('#hot28').append(point7_8);
            //                var point7_9 = $(this).find('point7text8').text();
            //                $('#hot29').append(point7_9);
            //                var point7_10 = $(this).find('point7text9').text();
            //                $('#hot9').append(point7_10);
            //                var point7_12 = $(this).find('point7text11').text();
            //                $('#hot22').append(point7_12);
            //                var point7_13 = $(this).find('point7text13').text();
            //                $('#hot50').append(point7_13);
         });
         $(document).find("point8text").each(function () {
            var point8_1 = $(this).find('point8headingText').text();
            $('.point8headingText').append(point8_1);
            var point8_2 = $(this).find('point8text1').text();
            $('#point8text .point8text1').append(point8_2);
            //                var point8_3 = $(this).find('point8text2').text();
            //                $('#hot30').append(point8_3);
            //                var point8_4 = $(this).find('point8text3').text();
            //                $('#hot31').append(point8_4);
            //                var point8_5 = $(this).find('point8text4').text();
            //                $('#hot32').append(point8_5);
            //                var point8_6 = $(this).find('point8text5').text();
            //                $('#hot33').append(point8_6);
            //                var point8_7 = $(this).find('point8text6').text();
            //                $('#hot34').append(point8_7);
            //                var point8_8 = $(this).find('point8text7').text();
            //                $('#hot35').append(point8_8);
            //                var point8_9 = $(this).find('point8text8').text();
            //                $('#hot7').append(point8_9);
            //                var point8_10 = $(this).find('point8text9').text();
            //                $('#hot8').append(point8_10);
         });
         $(document).find("point9text").each(function () {
            var point9_1 = $(this).find('point9headingText').text();
            $('.point9headingText').append(point9_1);
            var point9_2 = $(this).find('point9text1').text();
            $('#point9text1').append(point9_2);
            var point9_3 = $(this).find('point9text2').text();
            $('#hot51').append(point9_3);
            var point9_4 = $(this).find('point9text3').text();
            $('#hot52').append(point9_4);
            var point9_5 = $(this).find('point9text4').text();
            $('#hot53').append(point9_5);
            var point9_6 = $(this).find('point9text5').text();
            $('#hot54').append(point9_6);
            var point9_7 = $(this).find('point9text6').text();
            $('#hot55').append(point9_7);
            var point9_8 = $(this).find('point9text7').text();
            $('#hot56').append(point9_8);
            var point9_9 = $(this).find('point9text8').text();
            $('#hot57').append(point9_9);
            var point9_10 = $(this).find('point9text9').text();
            $('#hot58').append(point9_10);
            var point9_11 = $(this).find('point9text10').text();
            $('#hot59').append(point9_11);
            var point9_12 = $(this).find('point9text11').text();
            $('#hot60').append(point9_12);
            var point9_13 = $(this).find('point9text12').text();
            $('#hot61').append(point9_13);
            var point9_14 = $(this).find('point9text13').text();
            $('#hot62').append(point9_14);
         });
         $(document).find("point10text").each(function () {
            var point10_1 = $(this).find('headingText').text();
            $('#point10text p:nth-child(1)').append(point10_1);
            var point10_2 = $(this).find('point10text1').text();
            $('#point10text p:nth-child(2)').append(point10_2);
            var point10_3 = $(this).find('point10text2').text();
            $('#point10text p:nth-child(3)').append(point10_3);
            var point10_4 = $(this).find('point10text3').text();
            $('#point10text p:nth-child(4)').append(point10_4);
            var point10_5 = $(this).find('point10text4').text();
            $('#point10text p:nth-child(5)').append(point10_5);
            var point10_6 = $(this).find('point10text5').text();
            $('#point10text p:nth-child(6)').append(point10_6);
            var point10_7 = $(this).find('point10text6').text();
            $('#point10text ul li:nth-child(1)').append(point10_7);
            var point10_8 = $(this).find('point10text7').text();
            $('#point10text ul li:nth-child(2)').append(point10_8);
            var point10_9 = $(this).find('point10text8').text();
            $('#point10text ul li:nth-child(3)').append(point10_9);
            var point10_10 = $(this).find('point10text9').text();
            $('#point10text ul li:nth-child(4)').append(point10_10);
            var point10_11 = $(this).find('point10text10').text();
            $('#point10text ul li:nth-child(5)').append(point10_11);
         });
         $(document).find("point11text").each(function () {
            var point11_1 = $(this).find('point11text1').text();
            $('#point11text1').append(point11_1);
            var point11_2 = $(this).find('point11text2').text();
            $('#point11text2').append(point11_2);
            var point11_3 = $(this).find('point11text3').text();
            $('#point11text3').append(point11_3);
            var point11_4 = $(this).find('point11text4').text();
            $('#point11text4').append(point11_4);
            var point11_5 = $(this).find('point11text2').text();
            $('#point11text5').append(point11_5);
            var point11_6 = $(this).find('point11text6').text();
            $('#point11text6').append(point11_6);
            var point11_7 = $(this).find('point11text7').text();
            $('#point11text7').append(point11_7);
            //             	var point11_8 = $(this).find('point11text4').text();
            //             	$('#point11text8').append(point11_8);
            //             	var point11_9 = $(this).find('point11text2').text();
            //             	$('#point11text9').append(point11_9);
            var point11_10 = $(this).find('point11text3').text();
            $('#point11text10').append(point11_10);
            var point11_11 = $(this).find('point11text11').text();
            $('#point11text11').append(point11_11);
            var point11_12 = $(this).find('point11text7').text();
            $('#point11text12').append(point11_12);
            //             	var point11_13 = $(this).find('point11text2').text();
            //             	$('#point11text13').append(point11_13);
            //             	var point11_14 = $(this).find('point11text3').text();
            //             	$('#point11text14').append(point11_14);
            var point11_15 = $(this).find('point11text4').text();
            $('#point11text15').append(point11_15);
            var point11_li1_1 = $(this).find('point11_li1_1').text();
            $('#point11text6 ul li:nth-child(1)').append(point11_li1_1);
            var point11_li1_2 = $(this).find('point11_li1_2').text();
            $('#point11text6 ul li:nth-child(2)').append(point11_li1_2);
            var point11_li1_3 = $(this).find('point11_li1_3').text();
            $('#point11text6 ul li:nth-child(3)').append(point11_li1_3);
            var point11_li1_4 = $(this).find('point11_li1_4').text();
            $('#point11text6 ul li:nth-child(4)').append(point11_li1_4);
            var point11_li2_1 = $(this).find('point11_li2_1').text();
            $('#point11text11 ul li:nth-child(1)').append(point11_li2_1);
            var point11_li2_2 = $(this).find('point11_li2_2').text();
            $('#point11text11 ul li:nth-child(2)').append(point11_li2_2);
            var point11_li2_3 = $(this).find('point11_li2_3').text();
            $('#point11text11 ul li:nth-child(3)').append(point11_li2_3);
            var point11_li2_4 = $(this).find('point11_li2_4').text();
            $('#point11text11 ul li:nth-child(4)').append(point11_li2_4);
            var point11_li3_1 = $(this).find('point11_li3_1').text();
            $('#point11text15 ul li:nth-child(1)').append(point11_li3_1);
            var point11_li3_2 = $(this).find('point11_li3_2').text();
            $('#point11text15 ul li:nth-child(2)').append(point11_li3_2);
            var point11_li3_3 = $(this).find('point11_li3_3').text();
            $('#point11text15 ul li:nth-child(3)').append(point11_li3_3);
            var point11_li3_4 = $(this).find('point11_li3_4').text();
            $('#point11text15 ul li:nth-child(4)').append(point11_li3_4);
            var point11_li3_5 = $(this).find('point11_li3_5').text();
            $('#point11text15 ul li:nth-child(5)').append(point11_li3_5);
            var point11_li4_1 = $(this).find('point11_li4_1').text();
            $('#point11text12 ul li:nth-child(1)').append(point11_li4_1);
            var point11_li4_2 = $(this).find('point11_li4_2').text();
            $('#point11text12 ul li:nth-child(2)').append(point11_li4_2);
         });
         $(document).find("point12text").each(function () {
            var point12_1 = $(this).find('point12text1').text();
            $('#point12text .point12text1').append(point12_1);
            var point12_2 = $(this).find('point12text2').text();
            $('#point12text .point12text2').append(point12_2);
         });
         $(document).find("point13text").each(function () {
            var point13_1 = $(this).find('point13text1').text();
            $('#point13text .point13text1').append(point13_1);
         });
         $(document).find("point14text").each(function () {
            var point14_1 = $(this).find('point14text1').text();
            $('#point14text .point14text1').append(point14_1);
            var point14_2 = $(this).find('point14text2').text();
            $('#point14text .point14text2').append(point14_2);
         });
         $(document).find("point15text").each(function () {
            var point15_0 = $(this).find('point15heading').text();
            $('.point15headingText').append(point15_0);
         });
         $(document).find("point16text").each(function () {
            var point16_2 = $(this).find('point16text1').text();
            $('#point16text #hot1').append(point16_2);
            var point16_3 = $(this).find('point16text2').text();
            $('#point16text #hot2').append(point16_3);
            var point16_4 = $(this).find('point16text3').text();
            $('#point16text #hot3').append(point16_4);
            var point16_5 = $(this).find('point16text4').text();
            $('#point16text #hot4').append(point16_5);
            var point16_6 = $(this).find('point16text5').text();
            $('#point16text #hot5').append(point16_6);
            var point16_7 = $(this).find('point16text6').text();
            $('#point16text #hot533').append(point16_7);
         });
         $(document).find("point17text").each(function () {
            var point17_2 = $(this).find('point17text1').text();
            $('#point17text #hot6').append(point17_2);
            var point17_3 = $(this).find('point17text2').text();
            $('#point17text #hot7').append(point17_3);
            var point17_4 = $(this).find('point17text3').text();
            $('#point17text #hot8').append(point17_4);
            var point17_5 = $(this).find('point17text4').text();
            $('#point17text #hot9').append(point17_5);
            var point17_6 = $(this).find('point17text5').text();
            $('#point17text #hot511').append(point17_6);
         });
         $(document).find("point18text").each(function () {
            var point18_2 = $(this).find('point18text1').text();
            $('#point18text #hot10').append(point18_2);
            var point18_3 = $(this).find('point18text2').text();
            $('#point18text #hot11').append(point18_3);
            var point18_4 = $(this).find('point18text3').text();
            $('#point18text #hot12').append(point18_4);
            var point18_6 = $(this).find('point18text4').text();
            $('#point18text #hot13').append(point18_6);
            var point18_7 = $(this).find('point18text5').text();
            $('#point18text #hot14').append(point18_7);
            var point18_8 = $(this).find('point18text6').text();
            $('#point18text #hot15').append(point18_8);
            var point18_9 = $(this).find('point18text7').text();
            $('#point18text #hot16').append(point18_9);
            var point18_10 = $(this).find('point18text8').text();
            $('#point18text #hot17').append(point18_10);
            var point18_11 = $(this).find('point18text9').text();
            $('#point18text #hot18').append(point18_11);
         });
         $(document).find("point20text").each(function () {
            var point20_0 = $(this).find('headingText').text();
            $('#point20text .point20headingText').append(point20_0);
            var point20_2 = $(this).find('point20text1').text();
            $('#point20text #hot19').append(point20_2);
            var point20_3 = $(this).find('point20text2').text();
            $('#point20text #hot20').append(point20_3);
            var point20_4 = $(this).find('point20text3').text();
            $('#point20text #hot21').append(point20_4);
            var point20_6 = $(this).find('point20text4').text();
            $('#point20text #hot22').append(point20_6);
            var point20_7 = $(this).find('point20text5').text();
            $('#point20text #hot23').append(point20_7);
            var point20_8 = $(this).find('point20text6').text();
            $('#point20text #hot24').append(point20_8);
            //                 var point20_9 = $(this).find('point20text7').text();
            //                $('#point20text #hot25').append(point20_9);
            //                  
         });
         $(document).find("point23text").each(function () {
            var point23_2 = $(this).find('point23text1').text();
            $('#point23text #hot26').append(point23_2);
            var point23_3 = $(this).find('point23text2').text();
            $('#point23text #hot27').append(point23_3);
            var point23_4 = $(this).find('point23text3').text();
            $('#point23text #hot28').append(point23_4);
            var point23_5 = $(this).find('point23text4').text();
            $('#point23text #hot29').append(point23_5);
            var point23_6 = $(this).find('point23text5').text();
            $('#point23text #hot30').append(point23_6);
         });
         $(document).find("point24text").each(function () {
            var point24_2 = $(this).find('point24text1').text();
            $('#point24text #hot31').append(point24_2);
            var point24_3 = $(this).find('point24text2').text();
            $('#point24text #hot32').append(point24_3);
            var point24_4 = $(this).find('point24text3').text();
            $('#point24text #hot33').append(point24_4);
            var point24_6 = $(this).find('point24text4').text();
            $('#point24text #hot34').append(point24_6);
            var point24_7 = $(this).find('point24text5').text();
            $('#point24text #hot35').append(point24_7);
            var point24_8 = $(this).find('point24text6').text();
            $('#point24text #hot36').append(point24_8);
            var point24_9 = $(this).find('point24text7').text();
            $('#point24text #hot37').append(point24_9);
            var point24_10 = $(this).find('point24text8').text();
            $('#point24text #hot38').append(point24_10);
            var point24_11 = $(this).find('point24text9').text();
            $('#point24text #hot39').append(point24_11);
         });
         $(document).find("point21text").each(function () {
            var point21_0 = $(this).find('point21heading').text();
            $('.point21headingText').append(point21_0);
         });
         $(document).find("point22text").each(function () {
            var point22_0 = $(this).find('point22heading').text();
            $('.point22headingText').append(point22_0);
         });
         $(document).find("point23text").each(function () {
            var point23_0 = $(this).find('point23heading').text();
            $('.point23headingText').append(point23_0);
         });
         $(document).find("point25text").each(function () {
            var point25_0 = $(this).find('point25heading').text();
            $('.point25headingText').append(point25_0);
         });

         $(document).find("point26text").each(function () {
            var point26_2 = $(this).find('point26text1').text();
            $('#point26text #hot40').append(point26_2);
            var point26_3 = $(this).find('point26text2').text();
            $('#point26text #hot41').append(point26_3);
            var point26_4 = $(this).find('point26text3').text();
            $('#point26text #hot42').append(point26_4);
            var point26_6 = $(this).find('point26text4').text();
            $('#point26text #hot43').append(point26_6);
            var point26_7 = $(this).find('point26text5').text();
            $('#point26text #hot44').append(point26_7);
            var point26_8 = $(this).find('point26text6').text();
            $('#point26text #hot45').append(point26_8);
            var point26_9 = $(this).find('point26text7').text();
            $('#point26text #hot46').append(point26_9);

         });

         $(document).find("point27text").each(function () {
            var point27_0 = $(this).find('point27heading').text();
            $('.point27headingText').append(point27_0);
         });
         $(document).find("point28text").each(function () {
            var point28_0 = $(this).find('point28heading').text();
            $('.point28headingText').append(point28_0);
         });

         $(document).find("point29text").each(function () {
            var point29_2 = $(this).find('point29text1').text();
            $('#point29text #hot47').append(point29_2);
            var point29_3 = $(this).find('point29text2').text();
            $('#point29text #hot48').append(point29_3);
            var point29_4 = $(this).find('point29text3').text();
            $('#point29text #hot49').append(point29_4);
            var point29_6 = $(this).find('point29text4').text();
            $('#point29text #hot50').append(point29_6);
            var point29_7 = $(this).find('point29text5').text();
            $('#point29text #hot522').append(point29_7);

         });


         $(document).find("point2text").each(function () {
            var point2_1 = $(this).find('point2text1').text();
            $('#point2text .point2text1').append(point2_1);
         });
      }, // name of the function to call upon success
      error: function () {
         alert("Error: Something went wrong");
      }
   });
}

function translateIn(no) {
   $("#onloadCopy").css("opacity","1");
   //$("#point"+no+"text").fadeIn("50");
   $("#point" + no + "text > p:eq(0)").css({
      "webkitTransform": "translate(0,-5px)",
      "MozTransform": "translate(0,-5px)",
      "msTransform": "translate(0,-5px)",
      "OTransform": "translate(0,-5px)",
      "transform": "translate(0,-5px)",
      "opacity": "1"
   });
   $("#point" + no + "text > p:gt(0)").css({
      "webkitTransform": "translate(0,-5px)",
      "MozTransform": "translate(0,-5px)",
      "msTransform": "translate(0,-5px)",
      "OTransform": "translate(0,-5px)",
      "transform": "translate(0,-5px)",
      "opacity": "1"
   });
   $("#point" + no + "text p> ").css({
      "webkitTransform": "translate(0,-5px)",
      "MozTransform": "translate(0,-5px)",
      "msTransform": "translate(0,-5px)",
      "OTransform": "translate(0,-5px)",
      "transform": "translate(0,-5px)",
      "opacity": "1"
   });
   $("#point" + no + "text ul").css({
      "webkitTransform": "translate(0,-5px)",
      "MozTransform": "translate(0,-5px)",
      "msTransform": "translate(0,-5px)",
      "OTransform": "translate(0,-5px)",
      "transform": "translate(0,-5px)",
      "opacity": "1"
   });
   $("#point0image4").css({
      "webkitTransform": "translate(0,-5px)",
      "MozTransform": "translate(0,-5px)",
      "msTransform": "translate(0,-5px)",
      "OTransform": "translate(0,-5px)",
      "transform": "translate(0,-5px)",
      "opacity": "1"
   });
   $("#text1, #text2, #text3").css({
      "webkitTransform": "translate(0,-5px)",
      "MozTransform": "translate(0,-5px)",
      "msTransform": "translate(0,-5px)",
      "OTransform": "translate(0,-5px)",
      "transform": "translate(0,-5px)",
      "opacity": "0"
   });
   $(".headingText1").css('opacity','0');
   $(".headingText1").css({
      "webkitTransform": "translate(0,-5px)",
      "MozTransform": "translate(0,-5px)",
      "msTransform": "translate(0,-5px)",
      "OTransform": "translate(0,-5px)",
      "transform": "translate(0,-5px)"
   });
   $(".bodyText1").css('opacity','0');
   $(".bodyText1").css({
      "webkitTransform": "translate(0,-5px)",
      "MozTransform": "translate(0,-5px)",
      "msTransform": "translate(0,-5px)",
      "OTransform": "translate(0,-5px)",
      "transform": "translate(0,-5px)"
   });
   //    $("#point5text1,#point5text2,#point5text3,#point5text4").css({
   //		"webkitTransform":"translate(0,-5px)",
   //		"MozTransform":"translate(0,-5px)",
   //		"msTransform":"translate(0,-5px)",
   //		"OTransform":"translate(0,-5px)",
   //		"transform":"translate(0,-5px)",
   //        "opcity":"1"
   //	});
   //	$(".heading5Text, .body5Text, .heading6Text, .body6Text, .point6text6, .point6text7, .point6text8, .point6text9, .point6text10, .point6text11, .point6text12, .heading7Text, .body7Text, .point7text6, .point7text7, .point7text8, .point7text9, .point7text10, .point7text11, .point7text12").css('opacity','0');
   //	$(".heading5Text, .body5Text, .point5text6, .point5text7, .point5text8, .point5text9, .point5text10, .point5text11, .point5text12, .heading6Text, .body6Text, .point6text6, .point6text7, .point6text8, .point6text9, .point6text10, .point6text11, .point6text12, .heading7Text, .body7Text, .point7text6, .point7text7, .point7text8, .point7text9, .point7text10, .point7text11, .point7text12, .point7text1, .point7text2, .point7text3, .point7text4").css({
   //		"webkitTransform":"translate(0,0px)",
   //		"MozTransform":"translate(0,0px)",
   //		"msTransform":"translate(0,0px)",
   //		"OTransform":"translate(0,0px)",
   //		"transform":"translate(0,0px)"
   //	});
}

function translateOut(no) {
   //    $("#point11text2").fadeOut(500);
   //    $("#point11text3").fadeOut(500);
   //    $("#point11text4").fadeOut(500);
   $("#point" + no + "text").fadeOut(500);
   $("#image" + no).css({
      "webkitTransform": "translate(0,0px)",
      "MozTransform": "translate(0,0px)",
      "msTransform": "translate(0,0px)",
      "OTransform": "translate(0,0px)",
      "transform": "translate(0,0px)",
      "opacity": 0
   });
   $("#point" + no + "text > p:eq(0)").css({
      "webkitTransform": "translate(0,0px)",
      "MozTransform": "translate(0,0px)",
      "msTransform": "translate(0,0px)",
      "OTransform": "translate(0,0px)",
      "transform": "translate(0,0px)",
      "opacity": 0
   });
   $("#point" + no + "text > p:gt(0)").css({
      "webkitTransform": "translate(0,0px)",
      "MozTransform": "translate(0,0px)",
      "msTransform": "translate(0,0px)",
      "OTransform": "translate(0,0px)",
      "transform": "translate(0,0px)",
      "opacity": 0
   });
   $("#point" + no + "text > ul").css({
      "webkitTransform": "translate(0,0px)",
      "MozTransform": "translate(0,0px)",
      "msTransform": "translate(0,0px)",
      "OTransform": "translate(0,0px)",
      "transform": "translate(0,0px)",
      "opacity": 0
   });
   $(".menu").css({
      "webkitTransform": "translate(0,0px)",
      "MozTransform": "translate(0,0px)",
      "msTransform": "translate(0,0px)",
      "OTransform": "translate(0,0px)",
      "transform": "translate(0,0px)",
      "opacity": 0
   });
   $(".headingText1").css('opacity','0');
   $(".headingText1").css({
      "webkitTransform": "translate(0,0px)",
      "MozTransform": "translate(0,0px)",
      "msTransform": "translate(0,0px)",
      "OTransform": "translate(0,0px)",
      "transform": "translate(0,0px)"
   });
   $(".bodyText1").css('opacity','0');
   $(".bodyText1").css({
      "webkitTransform": "translate(0,0px)",
      "MozTransform": "translate(0,0px)",
      "msTransform": "translate(0,0px)",
      "OTransform": "translate(0,0px)",
      "transform": "translate(0,0px)"
   });
   $("#text1, #text2, #text3").css({
      "webkitTransform": "translate(0,0px)",
      "MozTransform": "translate(0,0px)",
      "msTransform": "translate(0,0px)",
      "OTransform": "translate(0,0px)",
      "transform": "translate(0,0px)",
      "opacity": 0
   });
   $(".body5Text, .point5text6, .point5text7, .point5text8, .point5text9, .point5text10,  .point5text12, .heading6Text, .body6Text, .point6text6, .point6text7, .point6text8, .point6text9, .point6text10, .point6text11, .point6text12").css('opacity','0');
   $(" .body5Text, .point5text6, .point5text7, .point5text8, .point5text9, .point5text10,  .point5text12, .heading6Text, .body6Text, .point6text6, .point6text7, .point6text8, .point6text9, .point6text10, .point6text11, .point6text12").css({
      "webkitTransform": "translate(0,0px)",
      "MozTransform": "translate(0,0px)",
      "msTransform": "translate(0,0px)",
      "OTransform": "translate(0,0px)",
      "transform": "translate(0,0px)"
   });
   $("#topheading").css({
      "webkitTransform": "translate(0,0px)",
      "MozTransform": "translate(0,0px)",
      "msTransform": "translate(0,0px)",
      "OTransform": "translate(0,0px)",
      "transform": "translate(0,0px)",
      "opacity": 0
   });
   $("#onloadCopy").css({
      "webkitTransform": "translate(0,0px)",
      "MozTransform": "translate(0,0px)",
      "msTransform": "translate(0,0px)",
      "OTransform": "translate(0,0px)",
      "transform": "translate(0,0px)",
      "opacity": 0
   });
}

function Reflection(params) {
   if (params == 'ref1') {
      scene.groupApplyState('Rear_1');
      scene.clearRefine();
   } else if (params == 'ref2') {
      scene.groupApplyState('Rear_2');
      scene.clearRefine();
   }
}