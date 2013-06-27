/**
 * Implements dojo/store/api/Store
 */
define(["dojo/when", "dojo/_base/lang", "dojo/_base/declare", "dojo/store/JsonRest", "./FlowFactory"], function(when, lang, declare, JsonRest, FlowFactory) {

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
		},
		_observeFunc: function(results) {
			var store = this;
			var listeners = [],
				queryUpdater;

			return function(listener, includeObjectUpdates) {
				if (listeners.push(listener) === 1) { // first listener was added, create the query checker and updater
					queryUpdater = function(changed, existingId) {
						when(results, function(resultsArray) {
							options = lang.mixin({},results.options);
							options.plain = true;
							when(store.query(results.query,options),function(newResults){
								var i, l, in_new = {};

								newResults.forEach(function(e,i){
									in_new[store.getIdentity(e)] = i;
								});

								for(i=0, l=resultsArray.length; i<l; i++) {
									var obj = resultsArray[i];
									var id = store.getIdentity(obj);
									if(id in in_new){
										var move_to = in_new[id];
										if(move_to !== i) {
											var swap = resultsArray[move_to];
											resultsArray[move_to] = resultsArray[i]
											resultsArray[i] = swap;
											i--;
										}
										if((move_to !== i) || includeObjectUpdates) {
											callListeners(listeners,obj,i+1,move_to);
											callListeners(listeners,swap,move_to, i+1);
										}
									}
								} 

								resultsArray.forEach(function(e,i){
									var id = store.getIdentity(e);
									olds[id] = [e,i];
									if(!(id in in_new)){
										callListeners(listeners,e,i,-1);
									}

									id_map[store.getIdentity(e)] = [i,e];
								})

								resultsArray.forEach(function(e,i){
									id_map[store.getIdentity(e)] = [i,e];
								})
								newResults = newResults.map(function(e,i){
									var id = store.getIdentity(e);
									if(id in id_map) {
										old_i = id_map[id][0];
										old_e = id_map[id][1];
										delete id_map[id];

									}
									return (id in id_map) ? id_map[i] : e; 
								});

								//Replace array contents with real results
								resultsArray.length = 0;
								resultsArray.push.apply(resultsArray, newResults);
							});

							/*
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
							*/
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
			if (options.plain)
				return results;
			results.then(function(resultsArray) {
				resultsArray.forEach(function(flowData) {
					FlowFactory.makeFlow(flowData);
				});
			});

			results.query = query;
			results.options = options;

			results.observe = this._observeFunc(results);
			return results;
		},
		notify: function(changed, existingId) {
			console.error("FIXME unimplemented", arguments);
		},
		on: function() {
			console.error("FIXME unimplemented", arguments);
		}
	});
	return FlowStore;
});