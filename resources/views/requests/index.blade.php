@extends('layouts.dashboard')
@section('requests', 'selected')
@section('requests_a', 'active')
@section('css')
@endsection
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
                        <h4 class="page-title">Requests List</h4>
                    </div>
                    <div class="col-lg-9 col-sm-8 col-md-8 col-xs-12">
                        <div class="d-md-flex">
                            <ol class="breadcrumb ms-auto">
                                <li><a href="{{ route('home') }}" class="fw-normal">Dashboard/Requests/List</a></li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container-fluid">
                <div id="trigger-response"></div>
                <div class="row">
                    <div class="col-sm-12">
                        <div class="white-box">
                            <p class="" style="position: relative;margin-bottom: -10px;color: #337ab7;"> Filter</p>
                            <p class="text-muted" style="position: relative;"><a href="{{ route('requestedAdd') }}" class="fas fa-plus-square" style="position: absolute;right: 0px;bottom: 0px;"> Add Request</a></p>
                            <hr />
                            <form method="get" action="{{ url('/requests/index') }}" enctype="multipart/form-data">
                                @csrf
                                @include('layouts.partials.messages')
                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label class="control-label">Title</label>
                                            <input type="text" id="title" name="title" value="{{$title}}" class="form-control" placeholder="title" />
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label class="control-label">Key Word</label>
                                            <input type="text" id="key_word" name="key_word" value="{{$key_word}}" class="form-control" placeholder="key word" />
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label class="control-label">Module</label>
                                            <select class="form-select" name="module" data-placeholder="Choose a Module" style="height: 33px;font-size: 12px;">
                                                <option value="">choose a module</option>
                                                @foreach ($module_list as $row)
                                                <option value="{{ $row->id }}" {{($module  ==  $row->id) ? "selected" : ""}}>{{ $row->name }}</option>
                                                @endforeach
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-4" style="margin-left:auto;">
                                        <div class="mb-1" style="margin-left: 150px;">
                                            <button type="submit" class="btn btn-success rounded-pill px-4">
                                                Filter
                                            </button>
                                            <button type="" class="btn btn-dark rounded-pill px-4">
                                                <a href="{{ route('requestedIndex') }}" title="Go Back">Reset</a>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <hr />
                            <div class="table-responsive" style="overflow: hidden;">
                                <table class="table text-nowrap">
                                    <thead>
                                        <tr>
                                            <th class="border-top-0">Name</th>
                                            <th class="border-top-0">Module</th>
                                            <th class="border-top-0">Key words</th>
                                            <th class="border-top-0">Created By</th>
                                            <th class="border-top-0">File</th>
                                            <th class="border-top-0">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @if(count($request_list) != 0)
                                        @foreach($request_list as $key=>$row)
                                        <tr>
                                            <td>{{$row->title}}</td>
                                            <td>{{$row->module_name}}</td>
                                            <td>{{strip_tags($row->key_word)}}</td>
                                            <td>{{$row->created_by}}</td>
                                            <td><a href="{{$row->file_path}}" title="Download file" download>{{$row->file_name}}</a> </td>
                                            <td>
                                                <a href="{{ url('requests/view/') }}/{{ $row->id }}" title="View"><i class="fas fa-eye"></i> </a>
                                                <a href="{{ url('requests/edit/') }}/{{ $row->id }}" title="Edit"><i class="fas fa-pencil-alt"></i> </a>
                                                <a href="#" class="" title="Delete"><i class="f far fa-trash-alt btnDeleteRow" data-url="{{ route('requestedDelete') }}" data-id="{{$row->id}}"></i></a>
                                            </td>
                                        </tr>
                                        @endforeach
                                        @else
                                        <tr>
                                            <td>
                                                <div class="alert alert-warning alert-dismissable" style="width: 230%;">
                                                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                                                    <i class="fa fa-exclamation-circle"></i> <strong>Sorry</strong>, there are no records.
                                                </div>
                                            </td>

                                        </tr>
                                        @endif
                                    </tbody>

                                </table>
                                <div class="pagination-row" style="position: relative;margin-left: 700px;">
                                    {{ $request_list->links() }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            @include('layouts.partials.footer')
        </div>
    </div>
</body>
@endsection
@section('scripts')
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
<script src="{{asset('js/request.js')}}"></script>
<script>
    $('.btnDeleteRow').click(function(e) {
        e.preventDefault();
        var id = $(this).data('id');
        if (confirm('Are you sure you want to delete this?')) {
            $.ajax({
                type: 'DELETE',
                url: "{{ route('requestedDelete') }}",
                data: {
                    'request_id': id,
                    '_token': "{{ csrf_token() }}"
                },
                success: function(response) {
                    $('#trigger-response').empty().prepend(response).fadeIn();
                    setTimeout(function() {
                        window.location.href = "{{ route('requestedIndex') }}";
                    }, 1000);
                },
                error: function(response) {

                }
            });
        }

    });
</script>
@endsection