/**
 * Implements dojo/store/api/Store
 */
define(["dojo/when", "dojo/_base/declare", "dojo/store/JsonRest", "./FlowFactory"], function(when, declare, JsonRest, FlowFactory) {

	var callListeners = function(listeners, object, removedFrom, insertedInto) {
		var copyListeners = listeners.slice();
		for (var i = 0, l = copyListeners.length; i < l; i++) {
			var listener = copyListeners[i];
			listener(object, removedFrom, insertedInto);
		}
	};

	var FlowStore = declare([JsonRest], {
		constructor: function() {
			this.queryUpdaters = [];
			this.revision = 0;
		},
		_observeFunc: function(queryRevision, results) {
			var store = this;
			var listeners = [],
				queryUpdater;

			return function(listener, includeObjectUpdates) {
				if (listeners.push(listener) === 1) { // first listener was added, create the query checker and updater
					queryUpdater = function(changed, existingId) {
						when(results, function(resultsArray) {
							if (++queryRevision !== store.revision) {
								throw new Error("Query is out of date, you must observe() the query prior to any data modifications");
							}
							if (changed) {
								when((!changed ? -1 : store.getIndex(store.getIdentity(changed), results.query, results.options)), function(newIndex) {

									var oldIndex = results.indexOf(existingId);
									var removedObject;

									if(oldIndex > -1 && newIndex > -1){ //Move
										console.log("Move element from %d to %d",oldIndex,newIndex);
										resultsArray.splice(oldIndex, 1);
										resultsArray.splice(newIndex, 0, changed);
									} else if(oldIndex > -1) { //Remove
										console.log("Remove element from %d",oldIndex);
										removedObject = resultsArray[oldIndex];
										resultsArray.splice(oldIndex, 1);
									} else if(newIndex > -1) { //Add
										console.log("Insert element at %d",newIndex);
										resultsArray.splice(newIndex, 0, changed);
									} else {
										//Change doesn't affect the result set
										return;
									}

									if(includeObjectUpdates || (oldIndex !== newIndex))
										callListeners(listeners, removedObject || changed, oldIndex, newIndex);
								});
							}

						});

					};
					store.queryUpdaters.push(queryUpdater);
					
				}

				var handle = {};
				handle.cancel = function() {
					// remove this listener
					var index = listeners.indexOf(listener);
					if (index > -1) { // check to make sure we haven't already called cancel
						listeners.splice(index, 1);
						if (!listeners.length) {
							// no more listeners, remove the query updater too
							store.queryUpdaters.splice(store.queryUpdaters.indexOf(queryUpdater), 1);
						}
					}
				};
				return handle;
			};
		},
		query: function(query, options) {
			var store = this;
			var results = this.inherited(arguments);
			//transform json objects into flows
			results.then(function(resultsArray) {
				resultsArray.forEach(function(flowData) {
					FlowFactory.makeFlow(flowData);
				});
			});

			results.query = query;
			results.options = options;

			results.observe = this._observeFunc(this.revision, results);
			results.indexOf = function(id) {
				if (!id)
					return -1;
				return when(results, function(resultsArray) {
					for (var i = 0, l = resultsArray.length; i < l; i++) {
						var object = resultsArray[i];
						if (store.getIdentity(object) === id) {
							return i;
						}
					}
					return -1;
				});
			};
			return results;
		},
		getIndex: function(id, query, options) {
			console.warn("getIndex", arguments);
			return -1;
		},
		notify: function(changed, existingId) {
			this.revision++;
			console.error("FIXME unimplemented", arguments);
		},
		on: function() {
			console.error("FIXME unimplemented", arguments);
		}
	});
	return FlowStore;
});