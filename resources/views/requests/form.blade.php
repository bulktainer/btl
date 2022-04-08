@extends('layouts.dashboard')
@section('requests', 'selected')
@section('requests_a', 'active')
@section('css')
<link href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.css" rel="stylesheet">
@endsection
@section('content')

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
                    <h4 class="page-title">Requests/ {{$form_type =='add'? 'Add':'Edit'}}</h4>
                </div>
                <div class="col-lg-9 col-sm-8 col-md-8 col-xs-12">
                    <div class="d-md-flex">
                        <ol class="breadcrumb ms-auto">
                            <li><a href="{{ route('home') }}" class="fw-normal">Dashboard/Requests {{$form_type == "add"? 'Add':'Edit'}}</a></li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-sm-12">
                    <div class="white-box">
                        <form method="post" action="{{ url('/requests/save') }}" enctype="multipart/form-data">
                            @csrf
                            @include('layouts.partials.messages')
                            <div class="form-body">
                                <h5 class="card-title">Request Details</h5>
                                <hr />
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="control-label">Title</label>
                                            <input type="hidden" id="request_id" name="request_id" value="{{$request_data->id}}" />
                                            <input type="text" id="title" name="title" value="{{$request_data->title}}" class="form-control"placeholder="title" required />
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="control-label"> Module</label>
                                            <select class="form-select" name="module" data-placeholder="choose a module"style="height: 33px;font-size: 12px;" required>
                                                <option value = "">choose a module</option>
                                                @foreach ($module_list as $row)
                                                <option value="{{ $row->id }}"{{($request_data->module_id  ==  $row->id) ? "selected" : ""}}>{{ $row->name }}</option>
                                                @endforeach
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="control-label">Key Word</label>
                                            <input type="text" id="key_word" name="key_word" value="{{$request_data->key_word}}" class="form-control"placeholder="key word" />
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                        <label class="control-label">Created By</label>
                                            <input type="text" id="created_by" name="created_by" value="{{$request_data->created_by}}" class="form-control"placeholder="created by" />
                                        </div>
                                    </div>
                                </div>                               
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="mb-3">
                                            <label class="control-label">Description</label>
                                            <textarea class="summernote" id="description" name="description">{{$request_data->description}}</textarea </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12">
                                        <input type="hidden" id="file_name" name="file_name" value="{{$request_data->file_name}}" />
                                        <input type="hidden" id="file_path" name="file_path" value="{{$request_data->file_path}}" />
                                            <div class="btn btn-info waves-effect waves-light">
                                            <span>{{$request_data->file_name}}</span>
                                                <input type="file" name ='file' class="upload" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            </bnr>
                            <div class="form-actions" style="padding-top: 20px;">
                                <button type="submit" class="btn btn-success rounded-pill px-4">
                                    Save
                                </button>
                                <button type="button" class="btn btn-dark rounded-pill px-4">
                                 <a href="{{ route('requestedAdd') }}" title="Go Back">Cancel</a>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            </div>
            @include('layouts.partials.footer')
        </div>
    </div>
    @endsection
    @section('scripts')
    <script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.js"></script>
    <script>
        $(document).ready(function() {
            $('.summernote').summernote({
                    toolbar: [
                        // [groupName, [list of button]]
                        ['style', ['style']],
                        ['style', ['bold', 'italic', 'underline', 'clear']],
                        ['font', ['strikethrough', 'superscript', 'subscript']],
                        ['fontsize', ['fontsize']],
                        ['color', ['color']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['height', ['height']],
                        ['fontname', ['fontname']],
                        ['table', ['table']],
                        ['insert', ['link', 'picture', 'video']],
                        ['view', ['fullscreen', 'codeview', 'help']]
                    ]

                }

            );
        })
    </script>
    @endsection