<aside class="left-sidebar" data-sidebarbg="skin6">
    <div class="scroll-sidebar">
        <nav class="sidebar-nav">
            <ul id="sidebarnav">
                <li class="sidebar-item pt-2 @yield('dashboard')">
                    <a class="sidebar-link waves-effect waves-dark sidebar-link @yield('dashboard_a')" href="{{ route('home') }}" aria-expanded="false">
                        <i class="far fa-clock" aria-hidden="true"></i>
                        <span class="hide-menu">Dashboard</span>
                    </a>
                </li>
                <li class="sidebar-item @yield('requests')">
                    <a class="sidebar-link waves-effect waves-dark sidebar-link @yield('requests_a')" href="{{ route('requestedIndex') }}" aria-expanded="false">
                        <i class="fa fa-user" aria-hidden="true"></i>
                        <span class="hide-menu">Request</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</aside>