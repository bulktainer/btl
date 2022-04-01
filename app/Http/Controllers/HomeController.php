<?php

namespace App\Http\Controllers;
use App\Models\moduleRequest;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        $request_count = moduleRequest::count();
        return view('dashboard/home',['request_count' => $request_count]);
    }
}
