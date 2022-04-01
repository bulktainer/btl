@extends('layouts.dashboard')
@section('dashboard', 'selected')
@section('dashboard_a', 'active')
@section('content')
<body>
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
                        <h4 class="page-title">Dashboard</h4>
                        
                    </div>
                </div>
            </div>
            <div class="container-fluid">
                <div class="row">
                <a class="" href="{{ route('requestedIndex') }}">
                    <div class="col-lg-4 col-md-12">
                        <div class="white-box analytics-info">
                            <h3 class="box-title">Request</h3>
                            <ul class="list-inline two-part d-flex align-items-center mb-0">
                                <li>
                                    <div id="sparklinedash3"><canvas width="67" height="30" style="display: inline-block; width: 67px; height: 30px; vertical-align: top;"></canvas>
                                    </div>
                                </li>
                                <li class="ms-auto"><span class="counter text-info">{{$request_count}}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                  </a>
                </div>
            </div>
            @include('layouts.partials.footer')
        </div>
    </div>
</body>
@endsection