@if(Session::has('success'))
<div class="alert alert-success" role="alert">
  <strong>Successful:</strong>
  {!! session('success') !!}
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>
@endif
@if( Session::has('warning'))
<div class="alert alert-info">
  <strong>Info!</strong> {{ Session::get('warning') }}
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span> </button>
</div>
@endif
@if( Session::has('danger'))
<div class="alert alert-danger">
  <strong>Danger!</strong> {{ Session::get('danger') }}
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span> </button>
</div>
@endif