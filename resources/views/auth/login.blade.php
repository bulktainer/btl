@extends('auth.layouts.app')
@section('content')
<div class="
          auth-wrapper
          d-flex
          no-block
          justify-content-center
          align-items-center
        " style="
          background: #ccc;
          background-size: cover;
          min-height: 100vh;
        ">
    <div class="auth-box p-4 bg-white rounded" style="width: 25%;">
        <div id="loginform">
            <div class="logo">
                <h3 class="box-title mb-3">Sign In</h3>
            </div>
            <!-- Form -->
            <div class="row">
                <div class="col-12">
                    <form class="form-horizontal mt-3 form-material" method="POST" id="loginform" action="{{ route('login') }}">
                        @csrf

                        <div class="form-group mb-3">
                            <div class="">
                                <input id="email" type="email" placeholder="Email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email">
                            </div>
                            @error('email')
                            <span class="error_feedback" style="color:#e12a6d">{{ $message }}</span>
                            @enderror
                        </div>
                        <div class="form-group mb-4">
                            <div class="">
                                <input id="password" type="password" placeholder="Password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password">
                            </div>
                            @error('password')
                            <span class="error_feedback" style="color:#e12a6d">{{ $message }}</span>
                            @enderror
                        </div>
                        <div class="form-group">
                            <div class="d-flex">
                                <div class="checkbox checkbox-info pt-0">
                                    <input class="form-check-input" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>
                                    <label class="form-check-label" for="remember">
                                        {{ __('Remember Me') }}
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="form-group text-center mt-4 mb-3">
                            <div class="col-xs-12">
                                <button class=" btn btn-info d-block w-100 waves-effect waves-light" type="submit">
                                    Log In
                                </button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>

    </div>
</div>

@endsection