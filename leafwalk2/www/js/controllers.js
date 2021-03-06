angular.module('leafWalk.controllers', [])
.controller('AppCtrl', function($scope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera, $cordovaImagePicker) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.registration = {};

  // Create the registration modal that we will use later
  $ionicModal.fromTemplateUrl('templates/register.html', {
      scope: $scope
  }).then(function (modal) {
      $scope.registerform = modal;
  });

  // Triggered in the registration modal to close it
  $scope.closeRegister = function () {
      $scope.registerform.hide();
  };

  // Open the registration modal
  $scope.register = function () {
      $scope.registerform.show();
  };

  // Perform the registration action when the user submits the registration form
  $scope.doRegister = function () {
      // Simulate a registration delay. Remove this and replace with your registration
      // code if using a registration system
      $timeout(function () {
          $scope.closeRegister();
      }, 1000);
  };

  // Form data for the login modal
  $scope.loginData = $localStorage.getObject('userinfo','{}');

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    $localStorage.storeObject('userinfo',$scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  //Use the phone's camera/ gets image from gallery
  $ionicPlatform.ready(function() {
      var options = {
          quality: 50,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 100,
          targetHeight: 100,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false
      };
       $scope.takePicture = function() {
          $cordovaCamera.getPicture(options).then(function(imageData) {
              $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
          }, function(err) {
              console.log(err);
          });

          $scope.registerform.show();

      };

      //Choose image from phone gallery
      var galleryOptions = {
          maximumImagesCount: 1,
          width: 100,
          height: 100,
          quality: 50
      };
      $scope.openGallery = function () {
          $cordovaImagePicker.getPictures(galleryOptions)
            .then(function (results) {
                $scope.registration.imgSrc = results[0];
                $scope.registerform.show();
            }, function (error) {
                console.log(error)
            });
      };
  });

  //Contact Us Form
  $scope.contact = {};

  // Create the contact modal that we will use later
  $ionicModal.fromTemplateUrl('templates/contactus.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.contactForm = modal;
  });

  // Triggered in the contact modal to close it
  $scope.closeContact = function() {
    $scope.contactForm.hide();
  };

  // Open the contact modal
  $scope.showContactForm = function() {
    $scope.contactForm.show();
  };

  // Perform the submit action when the user submits the contact form
  $scope.doContact = function() {
    console.log('Submitting comment form', $scope.contact);

    // Simulate a contact form delay. Remove this and replace with your reservation
    // code if using a server system
    $timeout(function() {
      $scope.closeContact();
    }, 1000);
  };
})

.controller('OpenSpacesController', ['$scope', 'openspaces', 'openSpacesFactory', 'favouriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast',
  function($scope, openspaces, openSpacesFactory, favouriteFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

  $scope.baseURL = baseURL;

  $scope.openspaces = openspaces;

  $scope.addFavorite = function (index) {
    console.log("index is " + index);
    favouriteFactory.addToFavourites(index);
    $ionicListDelegate.closeOptionButtons();


      $ionicPlatform.ready(function () {
        $cordovaLocalNotification.schedule({
            id: 1,
            title: "Added Favourite",
            text: $scope.openspaces[index].name
        }).then(function () {
            console.log('Added Favourite '+$scope.openspaces[index].name);
        },
        function () {
            console.log('Failed to add Notification ');
        });

        $cordovaToast
          .show('Added Favourite '+$scope.openspaces[index].name, 'long', 'center')
          .then(function (success) {
              // success
          }, function (error) {
              // error
          });
      });
  };

}])

.controller('IndexController', ['$scope', 'openspace', 'openSpacesFactory', 'baseURL',
  function($scope, openspace, openSpacesFactory, baseURL) {

    $scope.baseURL = baseURL;
    $scope.openspace = openspace;

}])
.controller('OpenSpaceDetailController', ['$scope', '$stateParams', 'openspace', 'openSpacesFactory', 'favouriteFactory', 'baseURL', '$ionicPopover', '$ionicModal', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast',
  function($scope, $stateParams, openspace, openSpacesFactory, favouriteFactory, baseURL, $ionicPopover, $ionicModal, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {
    $scope.baseURL = baseURL;
    $scope.openspace = {};
    $scope.showResults = false;
    $scope.message="Loading ...";

    //$scope.openspace = openSpacesFactory.get({id:parseInt($stateParams.id,10)})
    $scope.openspace = openspace
    .$promise.then(
      function(response){
          $scope.openspace = response;
          $scope.showResults = true;

          var myId = $scope.openspace.id;
          var openSpaceName = $scope.openspace.name;

          //Add to favourite
          $scope.addFavourite = function () {
              favouriteFactory.addToFavourites(myId);

              $ionicPlatform.ready(function () {
                  $cordovaLocalNotification.schedule({
                      id: 1,
                      title: "Added Favourite",
                      text: openSpaceName
                  }).then(function () {
                      console.log('Added Favourite ' + openSpaceName);
                  },
                  function () {
                      console.log('Failed to add Notification ');
                  });

                  $cordovaToast
                    .show('Added Favourite ' + openSpaceName, 'long', 'bottom')
                    .then(function (success) {
                        // success
                    }, function (error) {
                        // error
                    });
              });
              $scope.closePopover();
          };

          //Add comment
          $scope.addComment = function () {
              $scope.closePopover();
              $scope.openModal();
              console.log(addCommentForm.length);
          };

          //Popover
          $scope.popover = $ionicPopover.fromTemplateUrl('templates/openspace-detail-popover.html', {
              scope: $scope
          }).then(function (popover) {
              $scope.popover = popover;
          });

          $scope.openPopover = function ($event) {
              $scope.popover.show($event);
          };

          $scope.closePopover = function () {
              $scope.popover.hide();
          };

          $scope.$on('$destroy', function () {
              $scope.popover.remove();
          });

          //Modal
          $ionicModal.fromTemplateUrl('templates/openspace-comment.html', {
              scope: $scope,
              animation: 'slide-in-up'
          }).then(function (modal) {
              $scope.modal = modal;
          });

          $scope.openModal = function () {
              $scope.modal.show();
          };
          $scope.closeModal = function () {
              $scope.modal.hide();
          };

          $scope.$on('$destroy', function () {
              $scope.modal.remove();
          });

          //Comment
          $scope.mycomment = { rating: 5, comment: "", author: "", date: "" };

          $scope.submitComment = function () {

              $scope.mycomment.date = new Date().toISOString();
              console.log($scope.mycomment);

              $scope.openspace.comments.push($scope.mycomment);
              openSpacesFactory.update({ id: $scope.openspace.id }, $scope.openspace);

              //$scope.addCommentForm.$setPristine();

              $scope.mycomment = { rating: 5, comment: "", author: "", date: "" };

              $scope.closeModal();
          };
      },
      function(response) {
          $scope.message = "Error: "+response.status + " " + response.statusText;
      }
    );


}])
.controller('OpenSpaceCommentController', ['$scope', 'openSpacesFactory', function($scope,openSpacesFactory) {

    $scope.mycomment = {rating:5, comment:"", author:"", date:""};

    $scope.submitComment = function () {

        $scope.mycomment.date = new Date().toISOString();
        console.log($scope.mycomment);

        $scope.openspace.comments.push($scope.mycomment);
        openSpacesFactory.update({id:$scope.openspace.id},$scope.openspace);

        $scope.commentForm.$setPristine();

        $scope.mycomment = {rating:5, comment:"", author:"", date:""};
    }
}])

.controller('AboutController', ['$scope', 'leaders', 'corporateFactory', 'baseURL', function ($scope, corporateFactory, baseURL) {

    $scope.baseURL = baseURL;
    $scope.leaders = leaders;

}])
.controller('FavouritesController', ['$scope', 'openspaces', 'favourites', 'openSpacesFactory', 'favouriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout', '$ionicPlatform', '$cordovaVibration',
  function ($scope, openspaces, favourites, openSpacesFactory, favouriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout, $ionicPlatform, $cordovaVibration) {

    $scope.baseURL = baseURL;
    $scope.shouldShowDelete = false;

    $scope.favourites = favourites;
    $scope.openspaces = openspaces;

    /*$ionicLoading.show({
        template: '<ion-spinner></ion-spinner> Loading...'
    });*/

    //$scope.favourites = favouriteFactory.getFavourites();

    /*$scope.openspaces = openSpacesFactory.query(
      function (response) {
          $scope.openspaces = response;
          $timeout(function () {
              $ionicLoading.hide();
          }, 1000);
      },
      function (response) {
          $scope.message = "Error: " + response.status + " " + response.statusText;
          $timeout(function () {
            $ionicLoading.hide();
          }, 1000);
      });*/
      console.log($scope.openspaces, $scope.favourites);

      $scope.toggleDelete = function () {
          $scope.shouldShowDelete = !$scope.shouldShowDelete;
          console.log($scope.shouldShowDelete);
      }

      $scope.deleteFavourite = function (index) {
          var confirmPopup = $ionicPopup.confirm({
              title: 'Confirm Delete',
              template: 'Are you sure you want to delete this item?'
          });

          confirmPopup.then(function (res) {
            if (res) {
                console.log('Ok to delete');
                favouriteFactory.deleteFromFavourites(index);

                $ionicPlatform.ready(function() {
                  $cordovaVibration.vibrate(100);
                });
                
            } else {
                console.log('Canceled delete');
            }
          });

          $scope.shouldShowDelete = false;
      }}
  ])
  .filter('favouriteFilter', function () {
      return function (openspaces, favourites) {
        var out = [];
        for (var i = 0; i < favourites.length; i++) {
            for (var j = 0; j < openspaces.length; j++) {
                if (openspaces[j].id === favourites[i].id)
                    out.push(openspaces[j]);
            }
        }
        return out;

    }});

;
