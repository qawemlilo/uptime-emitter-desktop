'use strict'

const NEDB = require('nedb');
const path = require('path');
const config = require('../../config');


module.exports = function () {

   const Database = new NEDB({
     filename: path.join(config.STORAGE_ROOT, 'monitors.db'),
     autoload: true
   });

   const DB = {
     getAll: function () {
       return new Promise(function(resolve, reject){ //Or Q.defer() in Q
         Database.find({}, function (err, items) {
           if (err) {
             reject(err);
           }
           else {
             resolve(items);
           }
         });
       });
     },


     getOne: function (id) {
       return new Promise(function(resolve, reject){ //Or Q.defer() in Q
         Database.findOne({ _id: id }, function (err, doc) {
           if (err) {
             reject(err);
           }
           else {
             resolve(doc);
           }
         });
       });
     },


     get: function (query = {}) {
       return new Promise(function(resolve, reject){ //Or Q.defer() in Q
         Database.find(query).sort({ created_at: 1 }).exec(function (err, items) {
           if (err) {
             reject(err);
           }
           else {
             resolve(items);
           }
         });
       });
     },


     update: function (id, attrs) {

       return new Promise(function(resolve, reject) { //Or Q.defer() in Q
         Database.update({_id: id}, { $set: attrs }, {}, function (err, affectedRows, items) {
           if (err) {
             reject(err);
           }
           else {
             resolve(items);
           }
         });
       });
     },


     create: function (doc) {
       return new Promise(function(resolve, reject){ //Or Q.defer() in Q
         Database.insert(doc, function (err, newDoc) {
           if (err) {
             reject(err);
           }
           else {
             resolve(newDoc);
           }
         });
       });
     },


     remove: function (id) {
       return new Promise(function(resolve, reject){ //Or Q.defer() in Q
         Database.remove({_id: id}, {}, function (err, numRemoved) {
           if (err) {
             reject(err);
           }
           else {
             resolve(numRemoved);
           }
         });
       });
     }
  };

   return DB;
 }();
