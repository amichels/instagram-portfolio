// .value('$anchorScroll', angular.noop) disables angular autoscroll to top on veiw change
var App = angular.module("App", ["ngRoute", "ngAnimate"]).value('$anchorScroll', angular.noop);

App.filter('currentdate',['$filter',  function($filter) {
    return function() {
        return $filter('date')(new Date(), 'yyyy');
    };
}])

App.factory("fetchTag", function($http) {

  var data = function(callback) {
    var endPoint = "https://api.instagram.com/v1/users/768694115/media/recent/?client_id=48510c6730494f2bb77674473d0eaf42&callback=JSON_CALLBACK";

    $http.jsonp(endPoint).success(function(response) {
      callback(response);
    });
  };
 
  return (data);
});

App.factory("fetchPic",function($http) {
  var pic = function(id) {
    this.initialize = function() {
      var endPoint = "https://api.instagram.com/v1/media/"+id+"?client_id=48510c6730494f2bb77674473d0eaf42&callback=JSON_CALLBACK";
      var self = this;
       
      // When our $http promise resolves
      // Use angular.extend to extend 'this'
      // with the properties of the response
      $http.jsonp(endPoint).then(function(response) {
        angular.extend(self, response.data);  
      });
    };
 
    // Call the initialize function for every new instance
    this.initialize();
  };
 
  // Return a reference to the function
  return (pic);
});

App.factory("fetchMore",function($http) {
  var more = function(id) {
    this.initialize = function() {
      var endPoint ="https://api.instagram.com/v1/users/768694115/media/recent?max_id="+id+"&client_id=48510c6730494f2bb77674473d0eaf42&callback=JSON_CALLBACK";

      var self = this;
      $http.jsonp(endPoint).then(function(response) {
        angular.extend(self, response.data);
      });
    };
 
    this.initialize();
  };
 
  // Return a reference to the function
  return (more);
});
  
App.config(function($routeProvider) {
  $routeProvider
  .when('/', {
      templateUrl : 'pages/home.html',
      controller  : 'mainController'
  })
  .when('/details/:picId', {
      templateUrl : 'pages/details.html',
      controller  : 'detailsController'
  })
  .otherwise({
    redirectTo: '/home'
  });

})

App.controller("mainController", function($scope, $interval, fetchTag, fetchMore, $location) {
  $scope.pageClass = 'page-home';
  $scope.pics = [];
  $scope.pagination = [];
  $scope.temp = [];
  $scope.getInit = function() {
    fetchTag(function(data) {
      $scope.pics = data.data;
      $scope.pagination = data.pagination;
    });
  };
  $scope.getInit();

  $scope.getMore = function(id) {
    $scope.temp.push(new fetchMore(id));
    for(var i = 0; i < $scope.temp.length; ++i){
      console.log($scope.temp[i]['data']);
      for(var key in $scope.temp[i]) {
      }
    }
  };

  $scope.changeView = function(path,param,e){
    $location.path(path+param);
  };

});

App.controller("detailsController", function($scope, $interval, $routeParams, fetchPic) {
  $scope.pageClass = 'page-details';
  $scope.pic = [];
  $scope.picId = $routeParams.picId;

  $scope.getPic = function(id) {
    $scope.pic.push(new fetchPic(id));
  };

  $scope.getPic($scope.picId);
});

// Animation
App.animation('.view', function() {
  return {
    enter : function(element, done) {
      element.css('opacity',0);
      jQuery(element).animate({
        opacity: 1
      }, done);

      // optional onDone or onCancel callback
      // function to handle any post-animation
      // cleanup operations
      return function(isCancelled) {
        if(isCancelled) {
          jQuery(element).stop();
        }
      }
    },
    leave : function(element, done) {
      element.css('opacity', 1);
      jQuery(element).animate({
        opacity: 0
      }, done);

      // optional onDone or onCancel callback
      // function to handle any post-animation
      // cleanup operations
      return function(isCancelled) {
        if(isCancelled) {
          jQuery(element).stop();
        }
      }
    },
    move : function(element, done) {
      element.css('opacity', 0);
      jQuery(element).animate({
        opacity: 1
      }, done);

      // optional onDone or onCancel callback
      // function to handle any post-animation
      // cleanup operations
      return function(isCancelled) {
        if(isCancelled) {
          jQuery(element).stop();
        }
      }
    },

    // you can also capture these animation events
    addClass : function(element, className, done) {},
    removeClass : function(element, className, done) {}
  }
});

// jQuery
$(document).ready(function(){

  var trianglify = function(){
    var pattern = Trianglify({
      width: window.innerWidth,
      height: window.innerHeight
    });
    var bg = $("#bg");
    bg.empty();
    bg.append(pattern.svg());
  }

  // Render triangle bg on page load
  trianglify();

  $(window).on('resize', function(){
    var win = $(this),
      width = win.width(),
      height = win.height();
    trianglify();
  });
});


