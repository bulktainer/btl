<header class="topbar" data-navbarbg="skin5">
    <nav class="navbar top-navbar navbar-expand-md navbar-dark">
        <div class="" data-logobg="skin6">
            <a class="navbar-brand" style="" href="dashboard.html">
                <b class="logo-icon">
                    <img src="{{asset('plugins/images/bulkcon-inter-header.png')}}" alt="homepage" style="width: 180px;" />
                </b>
            </a>
            <a class="nav-toggler waves-effect waves-light text-dark d-block d-md-none" href="javascript:void(0)"><i class="ti-menu ti-close"></i></a>
        </div>
        <div class="navbar-collapse collapse" id="navbarSupportedContent" data-navbarbg="skin5">
            <ul class="navbar-nav ms-auto d-flex align-items-center">
                <li>
                    <div class="dropdown" style="margin-left: 970px">
                        <span class="ext-white" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="color: white;padding: 20px;font-size: 10px;">
                            {{ Auth::user()->name }}
                        </span>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <div class="" aria-labelledby="navbarDropdown">
                                <a class="dropdown-item" href="{{ route('logout') }}" onclick="event.preventDefault();
                                                     document.getElementById('logout-form').submit();">
                                    {{ __('Logout') }}
                                </a>

                                <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                                    @csrf
                                </form>
                            </div>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    </nav>
</header>