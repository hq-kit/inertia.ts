<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Purchase;
use App\Models\Sale;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Http\Request;

class TimelineController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $members = Member::query()->select('id', 'nickname')->get();
        $suppliers = Supplier::query()->select('id', 'name')->get();
        $users = User::query()->select('id', 'name')->get();

        $user = $request->user ?? null;
        $member = $request->member ?? null;
        $supplier = $request->supplier ?? null;
        $from = $request->from ?? null;
        $to = $request->to ?? null;
        $type = $request->type;

        $sales = Sale::query()->with('member')
            ->when($member, function ($query, $member) {
                return $query->where('member_id', $member);
            })
            ->when($from, function ($query, $from) {
                return $query->where('created_at', '>=', $from);
            })
            ->when($to, function ($query, $to) {
                return $query->where('created_at', '<=', $to);
            })
            ->when($user, function ($query, $user) {
                return $query->where('user_id', $user);
            })
            ->paginate();
        $purchases = Purchase::query()->with('supplier')
            ->when($supplier, function ($query, $supplier) {
                return $query->where('supplier_id', $supplier);
            })
            ->when($from, function ($query, $from) {
                return $query->where('created_at', '>=', $from);
            })
            ->when($to, function ($query, $to) {
                return $query->where('created_at', '<=', $to);
            })
            ->when($user, function ($query, $user) {
                return $query->where('user_id', $user);
            })
            ->paginate();

        $data = $type === 'sale' ? $sales : $purchases;

        return inertia('timeline', [
            'members' => fn () => $members,
            'suppliers' => fn () => $suppliers,
            'users' => fn () => $users,
            'data' => fn () => $data,
            'from' => $from,
            'to' => $to,
            'type' => $type,
        ]);
    }
}
