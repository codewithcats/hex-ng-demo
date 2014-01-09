'use strict';

describe('EventAdapter', function () {

  // load the controller's module
  beforeEach(module('ngArchitectApp'));
  beforeEach(module(function($provide) {
    $provide.value('eventAdapterConfig', {
      'in': {
        'X': ['S1', 'S2'],
        'Z': ['S1']
      },
      'out': {
        'X': ['D1', 'D2'],
        'Y': ['D2'],
        'Z': ['D3']
      }
    });
  }));

  var adapter;
  // Initialize the controller and a mock scope
  beforeEach(inject(function(EventAdapter) {
    adapter = EventAdapter;
  }));

  it('should be defined', function() {
    expect(adapter).toBeDefined();
  });

  describe('function: on', function() {
    it('should store listener to config event', function() {
      var d1 = function() {};
      adapter.on('D1', d1);
      var list = adapter.listenersOf('X');
      expect(list).toContain(d1); 

      var d2 = function() {};
      adapter.on('D2', d2);
      list = adapter.listenersOf('X');
      expect(list).toContain(d2); 
      expect(list).toContain(d1); 

      list = adapter.listenersOf('Y');
      expect(list).toContain(d2); 
    });
  });

  describe('function: broadcast', function() {
    it('should call all listeners register for config event', function() {
      var d1 = jasmine.createSpy('d1 listener'); 
      var d2 = jasmine.createSpy('d2 listener'); 
      adapter.on('D1', d1);
      adapter.on('D1', d2);
      adapter.broadcast('S1');
      expect(d1).toHaveBeenCalled();
      expect(d2).toHaveBeenCalled();
      d1.reset();d2.reset();

      adapter.broadcast('S2');
      expect(d1).toHaveBeenCalled();
      expect(d2).toHaveBeenCalled();
    });
    
    it('should broadcast to different medium', function() {
      var d1 = jasmine.createSpy('d1 listener'); 
      var d2 = jasmine.createSpy('d2 listener'); 
      var d3 = jasmine.createSpy('d3 listener'); 
      adapter.on('D1', d1);
      adapter.on('D2', d2);
      adapter.on('D3', d3);
      adapter.broadcast('S1');
      expect(d1).toHaveBeenCalled();
      expect(d2).toHaveBeenCalled();
      expect(d3).toHaveBeenCalled();
    });


  });

});
