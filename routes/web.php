<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
Route::get('/', function () {
  if (Auth::check()) {
    return redirect('home');
  } else {
    return view('auth/login');
  }
});
Auth::routes();
Route::group(['middleware' => ['auth:admin'], 'namespace' => 'App\Http\Controllers'], function () {
  Route::get('/home', 'HomeController@index')->name('home');
  Route::group(['prefix' => 'requests'], function () {
    Route::get('/index', 'RequestController@index')->name('requestedIndex');
    Route::get('/add', 'RequestController@add')->name('requestedAdd');
    Route::post('/save', 'RequestController@save')->name('requestedSave');
    Route::get('/edit/{id}', 'RequestController@edit')->name('requestedEdit');
    Route::get('/view/{id}', 'RequestController@view')->name('requestedView');
    Route::delete('/delete', 'RequestController@delete')->name('requestedDelete');
  });
});
