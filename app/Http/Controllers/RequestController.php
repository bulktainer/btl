<?php

namespace App\Http\Controllers;

use DB;
use Auth;
use Illuminate\Http\Request;
use App\Models\module;
use App\Models\moduleRequest;
use App\Services\SharepointService;
use Illuminate\Support\Facades\Validator;

class RequestController extends Controller
{
    public function index(Request $request)
    {
        $title = $request->title;
        $module = $request->module;
        $key_word = $request->key_word;
        $request_query = moduleRequest::select('requests.title', 'requests.key_word', 'requests.created_by', 'requests.file_name', 'requests.file_path', 'requests.id', 'requests.description', 'modules.name as module_name', 'users.name as user_name')
            ->leftJoin('modules', 'modules.id', '=', 'requests.module_id')
            ->leftJoin('users', 'users.id', '=', 'requests.user_id');
            
        if (!empty($title)) {
            $request_query->where('requests.title', 'LIKE', "%{$title}%");
        }
        if (!empty($key_word)) {
            $request_query->where('requests.key_word', 'LIKE', "%{$key_word}%");

        }
        if (!empty($module)) {
            $request_query->where('requests.module_id', '=', "$module");
        }
        $request_list = $request_query->cursorPaginate(5);
        $module_list = module::get();

        return view('requests/index', [
            'request_list' => $request_list,
            'module_list' => $module_list,
            'title' => $title,
            'module' => $module,
            'key_word'=>$key_word
        ]);
    }

    public function add()
    {
        $module_list = module::get();
        return view('requests/form', ['module_list' => $module_list, 'request_data' => new Request()]);
    }


    public function save(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title'                => 'required',
            'module'               => 'required',
            'created_by'         => 'required',
        ]);
        if ($validator->fails()) {
            session()->flash('danger', 'Validation Is Failed');
            return redirect('requests/add');
        }
        try {
            $path = '';
            $name = '';
            if ($request->file('file')) {

                $validator = Validator::make($request->all(), [
                    'file' => 'required|mimes:png,jpg,jpeg,csv,txt,xlx,xls,pdf|max:2048'
                ]);
                if ($validator->fails()) {
                    session()->flash('danger', 'Validation Is Failed');
                    return redirect('requests/add');
                }
                $name = $request->file('file')->getClientOriginalName();
                $response = SharepointService::uploadFile($request->file('file'), $name);
                $path = 'https://digitalmeshsoftech.sharepoint.com/' . $response;
            } else {
                $path = $request->file_path;
                $name = $request->file_name;
            }
            if ($request->request_id == '') {
                DB::table('requests')->insert([
                    'title' => $request->title,
                    'module_id' => $request->module,
                    'description' => $request->description,
                    'updated_at' => \Carbon\Carbon::now(),
                    'user_id' => Auth::user()->id,
                    'file_name' =>  $name,
                    'file_path' => $path,
                    'key_word' =>  $request->key_word,
                    'created_by' => $request->created_by

                ]);
            } else {
                DB::table('requests')
                    ->where('id', $request->request_id)
                    ->update([
                        'title' => $request->title,
                        'module_id' => $request->module,
                        'description' => $request->description,
                        'updated_at' => \Carbon\Carbon::now(),
                        'user_id' => Auth::user()->id,
                        'file_name' =>  $name,
                        'file_path' => $path,
                        'key_word' =>  $request->key_word,
                        'created_by' => $request->created_by
                    ]);
            }

            session()->flash('success', 'Request Add Successfully');
            return redirect('requests/index');
        } catch (GuzzleException $e) {
            $errors = json_decode($e);
            return redirect('register')
                ->withErrors($errors);
        }
    }

    public function edit($id)
    {
        $request_data = moduleRequest::where('id', $id)->first();
        $module_list = module::get();
        return view('requests/form', ['module_list' => $module_list, 'request_data' => $request_data]);
    }

    public function view($id)
    {

        $request_data = moduleRequest::select('requests.title', 'requests.key_word', 'requests.created_by', 'requests.file_name', 'requests.file_path', 'requests.id', 'requests.description', 'modules.name as module_name')
            ->leftJoin('modules', 'modules.id', '=', 'requests.module_id')
            ->where('requests.id', $id)
            ->first();
        return view('requests/view', ['request_data' => $request_data]);
    }


    public function delete(Request $request)
    {
        $data = DB::table('requests')->where('id', $request->request_id)->delete();
        if ($data) {
            echo '  <div class="alert alert-success">
          <strong>Success!</strong> Request successful deleted.
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        </div>';
        } else {
            echo '  <div class="alert alert-danger">
        <strong>Danger!</strong>Action error occured.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      </div>';
        }
    }
}
