'use strict';

var urbnCalendarApp = angular.module('urbnCalendarApp', ['ngAnimate', 'ui.bootstrap', 'holidayPlannerApp']);

urbnCalendarApp.controller('URBNCalendarCtrl',
  function($scope, $compile, $timeout, uiCalendarConfig, Auth, User) {

    $scope.user = Auth.getCurrentUser();

    $scope.events = [];
    $scope.allUsers = [];
    $scope.allEvents = [];
    $scope.events = $scope.user.events;
    $scope.currentEvent = null;

    User.query().$promise.then(function(user) {
      angular.forEach(user, function(u) {
        if(u._id !== $scope.user._id) {
          $scope.allUsers.push(u);
          angular.forEach(u.events, function (e) {
            e.color = 'gray';
            $scope.allEvents.push(e);
          });
        }
      });
    });

    $scope.dayCounter = $scope.user.daysBooked;

    $scope.eventName = '';

    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, timezone, callback) {
      callback($scope.allEvents);
    };
    /* alert on eventClick */
    $scope.alertOnEventClick = function(date){

      var id = [date.id],
          truthy = 0;

      for(var i = 0; i < $scope.allEvents.length; i++) {
        if(id.indexOf($scope.allEvents[i].id) !== -1) {
          truthy = 0;
          break;
        }
        else {
          truthy += 1;
        }
      }

      if(truthy > 0) {
        $('#editEvent').modal();
        $scope.currentEvent = date;
        $scope.setDate(date);
      }
      //$scope.alertMessage = (date.title + ' was clicked ');
    };
    /* alert on Drop */
    $scope.alertOnDrop = function(event){
      //$scope.alertMessage = ('Changed event start day');
      $scope.addRemoveEventSource($scope.events, event);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, delta){
      $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {

      angular.forEach(sources,function(value, key){
        if(angular.equals(sources[key].id, source.id)) {

          Auth.updateEvents({
            title: source.title,
            start: source.start._d,
            end: source.end._d
          },sources[key].id);

          $scope.countDays(
            source.start._d,
            source.end._d,
            new Date(sources[key].start),
            new Date(sources[key].end)
          );

          $scope.updateEventsArray({
            title: source.title,
            start: source.start._d,
            end: source.end._d
          }, sources[key].id);

        }
      });

    };
    /* add custom event*/
    $scope.addEvent = function() {
      if ($scope.eventName) {

        var id = Date.now(),
            event = {
              title: this.eventName,
              start: this.sd,
              end: this.ed,
              className: [this.eventName],
              id: id,
              stick: true,
              allDay : true
            };

        Auth.updateEvents(event);
        $scope.events.push(event);

        $scope.countDays(this.sd,this.ed);

        $scope.eventName = '';
      }
      $scope.closeModal('#myModal');
    };

    $scope.closeModal = function(modal) {
      $(modal).modal('hide');
    };

    $scope.editEvent = function() {
      var event = {
          title: this.title,
          start: {
            _d: this.sd
          },
          end: {
            _d: this.ed
          },
          className: [this.title],
          id: $scope.id,
          stick: true,
          allDay : true
        };

      $scope.addRemoveEventSource($scope.events, event);
      $scope.closeModal('#editEvent');

    };

    function isEmpty(obj) {
      for(var prop in obj) {
        if(obj.hasOwnProperty(prop)) {
          return false;
        }
      }
      return true;
    }

    $scope.updateEventsArray = function(newEvent, oldEvent) {
      var oldEventId = [];
      if (oldEvent !== undefined) {
        oldEventId.push(oldEvent);
      }

      if(!isEmpty(oldEventId)) {
        var chosenEvent;

        for(var i = 0; i < $scope.events.length; i++) {

          if(oldEventId.indexOf($scope.events[i].id) !== -1) {
            chosenEvent = $scope.events[i];
            $scope.events.splice(i,1);
            chosenEvent.title = newEvent.title;
            chosenEvent.start = newEvent.start;
            chosenEvent.end = newEvent.end;
          }
        }
        if(chosenEvent) {
          $scope.events.push(chosenEvent);
        }
      }
    };

    $scope.removeEvent = function() {
      var confirmation = window.confirm('Are you sure you want to remove this event from the calendar?');
      if (confirmation) {
        var id = [$scope.currentEvent.id];

        for(var i = 0; i < $scope.events.length; i++) {
          if(id.indexOf($scope.events[i].id) !== -1) {
            $scope.events.splice(i,1);
          }
        }

        Auth.updateEvents(null,$scope.currentEvent.id);
        $scope.closeModal('#editEvent');

        var dayCount = ($scope.currentEvent.start._d.getTime() - $scope.currentEvent.end._d.getTime()) / (1000*60*60*24);
        $scope.dayCounter = $scope.dayCounter - Math.abs(dayCount);
        Auth.countDays(dayCount);
      } else {
        // Do nothing!
      }

    };

    $scope.countDays = function(start, end, otherStart, otherEnd) {
      var diff1 = (end.getTime() - start.getTime()) / (1000*60*60*24);
      if (otherStart && otherEnd) {
        var diff2 = (otherEnd.getTime() - otherStart.getTime()) / (1000*60*60*24);
        var total = diff1 - diff2;
        if (total >= 0) {
          $scope.dayCounter = $scope.dayCounter + total;
        }
        else {
          $scope.dayCounter = $scope.dayCounter - Math.abs(total);
        }
        Auth.countDays(total);
      }
      else if (!otherStart && !otherEnd) {
        $scope.dayCounter = $scope.dayCounter + diff1;
        Auth.countDays(diff1);
      }
    };

    /* Change View */
    $scope.changeView = function(view,calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalender = function(calendar) {
      $timeout(function() {
        if(uiCalendarConfig.calendars[calendar]){
          uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
      });
    };
    /* Render Tooltip */
    $scope.eventRender = function( event, element) {
      element.attr({'tooltip': event.title,
        'tooltip-append-to-body': true});
      $compile(element)($scope);
    };

    $scope.select = function(start, end) {
      $('#myModal').modal();
      var date = [{
        start: {},
        end: {}
      }];
      date.start = start;
      date.end = end;
      $scope.setDate(date);
    };

    $scope.setDate = function(date) {
      $scope.sd = date.start._d;
      $scope.ed = date.end._d;
      $scope.title = date.title;
      $scope.id = date.id;
    };

    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'title',
          center: '',
          right: 'today prev,next'
        },
        timeFormat: 'h:mm',
        selectOverlap: true,
        selectable: true,
        selectHelper: true,
        select: $scope.select,
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender,
        businessHours: {
          start: '09:00', // a start time (10am in this example)
          end: '18:00', // an end time (6pm in this example)

          dow: [ 1, 2, 3, 4, 5 ]
          // days of week. an array of zero-based day of week integers (0=Sunday)
          // (Monday-Thursday in this example)
        },
        displayEventEnd: true
      }
    };
    /* event sources array*/
    $scope.eventSources = [$scope.events, $scope.eventsF];

  });
/* EOF */
