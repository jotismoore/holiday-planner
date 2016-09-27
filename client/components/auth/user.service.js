'use strict';

angular.module('holidayPlannerApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      updateEvents: {
        method: 'PUT',
        params: {
          controller:'events'
        }
      },
      updateDays: {
        method: 'PUT',
        params: {
          controller:'days'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
	  });
  });
