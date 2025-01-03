<?php

namespace App\Http\Controllers;

use App\Http\Resources\MemberResource;
use App\Models\Member;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, ?Member $member = null)
    {
        $show = $request->show ?? 10;
        $search = $request->q ?? null;

        $members = Member::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%$search%");
            })
            ->paginate($show);

        return inertia('members/index', [
            'members' => fn () => MemberResource::collection($members),
            'member' => $member ? MemberResource::make($member) : new Member,
            'form' => [
                'title' => $member ? 'Edit Member' : 'Create Member',
                'route' => $member ? route('members.update', $member->id) : route('members.store'),
                'method' => $member ? 'PUT' : 'POST',
            ],
            'page_options' => [
                'show' => $show,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        return $this->index($request);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:members,name'],
            'nickname' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
        ]);

        Member::query()->create($validated);
        toast('success', 'Member created successfully');

        return to_route('members.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Member $member)
    {
        return inertia('members/show', [
            'member' => MemberResource::make($member),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Member $member)
    {
        return $this->index($request, $member);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Member $member)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:members,name,'.$member->id],
            'nickname' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
        ]);

        $member->update($validated);
        toast('success', 'Member updated successfully');

        return to_route('members.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Member $member)
    {
        $member->delete();
        toast('success', 'Member deleted successfully');

        return to_route('members.index');
    }

    public function updateVoucher(Request $request, Member $member)
    {
        $validated = $request->validate([
            'voucher' => ['required', 'numeric'],
        ]);

        $member->update($validated);
        toast('success', 'Voucher updated successfully');

        return to_route('members.index');
    }

    public function resetVoucher(Request $request)
    {
        $validated = $request->validate([
            'voucher' => ['required', 'numeric'],
        ]);

        // reset voucher for all members
        Member::query()->update($validated);
        toast('success', 'Voucher reset successfully');

        return to_route('members.index');
    }

    public function getAll(Request $request)
    {
        return response()->json(Member::query()->select('id', 'nickname')->get());
    }
}
