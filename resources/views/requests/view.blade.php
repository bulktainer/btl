@extends('layouts.dashboard')
@section('requests', 'selected')
@section('requests_a', 'active')
@section('content')
@section('css')
<link rel="stylesheet" href="{{asset('css/request.css')}}">
@endsection
<div class="preloader">
    <div class="lds-ripple">
        <div class="lds-pos"></div>
        <div class="lds-pos"></div>
    </div>
</div>
<div id="main-wrapper" data-layout="vertical" data-navbarbg="skin5" data-sidebartype="full" data-sidebar-position="absolute" data-header-position="absolute" data-boxed-layout="full">
    @include('layouts.partials.header')
    @include('layouts.partials.side_bar')
    <div class="page-wrapper">
        <div class="page-breadcrumb bg-white">
            <div class="row align-items-center">
                <div class="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                    <h4 class="page-title">Requests View</h4>
                </div>
                <div class="col-lg-9 col-sm-8 col-md-8 col-xs-12">
                    <div class="d-md-flex">
                        <ol class="breadcrumb ms-auto">
                            <li><a href="{{route('home')}}" class="fw-normal">Dashboard/Requests/View</a></li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-sm-12">
                    <div class="white-box">
                        <div class="container">
                            <div class="team-single">
                                <div class="col">
                                    <div class="team-single-text padding-50px-left sm-no-padding-left">
                                        <div class="contact-info-section margin-40px-tb">
                                            <ul class="list-style9 no-margin">
                                               <li>
                                                    <div class="row">
                                                        <div class="col-md-5 col-5">
                                                            <strong class="margin-10px-left">Request Name:</strong>
                                                        </div>
                                                        <div class="col-md-7 col-7">
                                                            <p>{{$request_data->title}}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div class="row">
                                                        <div class="col-md-5 col-5">
                                                            <strong class="margin-10px-left">Module Name:</strong>
                                                        </div>
                                                        <div class="col-md-7 col-7">
                                                            <p>{{$request_data->module_name}}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div class="row">
                                                        <div class="col-md-5 col-5">
                                                            <strong class=" margin-10px-left">Key Words:</strong>
                                                        </div>
                                                        <div class="col-md-7 col-7">
                                                            <p>{{$request_data->key_word}}</p>
                                                        </div>
                                                    </div>

                                                </li>
                                                <li>

                                                    <div class="row">
                                                        <div class="col-md-5 col-5">
                                                            <strong class="margin-10px-left">Created By:</strong>
                                                        </div>
                                                        <div class="col-md-7 col-7">
                                                            <p>{{$request_data->created_by}}</p>
                                                        </div>
                                                    </div>

                                                </li>
                                                <li>
                                                    <div class="row">
                                                        <div class="col-md-5 col-5">
                                                            <strong class="margin-10px-left">File:</strong>
                                                        </div>
                                                        <div class="col-md-7 col-7">
                                                            <p><a href="{{$request_data->file_path}}" title="Download file" download>{{$request_data->file_name}}</a></p>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div class="row">
                                                        <div class="col-md-5 col-5">
                                                            <strong class="margin-10px-left">Description:</strong>
                                                        </div>
                                                        <div class="col-md-7 col-7">
                                                            <p>{{strip_tags($request_data->description)}}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <hr>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        @include('layouts.partials.footer')
    </div>
</div>
@endsection