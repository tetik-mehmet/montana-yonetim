const membershipRepository = require("../repositories/membershipRepository");
const memberRepository = require("../repositories/memberRepository");
const packageRepository = require("../repositories/packageRepository");

class MembershipService {
  // Get all memberships
  async getAllMemberships() {
    return await membershipRepository.findAll();
  }

  // Get active memberships
  async getActiveMemberships() {
    return await membershipRepository.findActive();
  }

  // Get expired memberships
  async getExpiredMemberships() {
    return await membershipRepository.findExpired();
  }

  // Get memberships by member id
  async getMembershipsByMemberId(memberId) {
    return await membershipRepository.findByMemberId(memberId);
  }

  // Assign package to member
  async assignPackageToMember(memberId, packageId, startDate) {
    // Validate member exists
    const member = await memberRepository.findById(memberId);
    if (!member) {
      throw new Error("Üye bulunamadı");
    }

    // Validate package exists
    const pkg = await packageRepository.findById(packageId);
    if (!pkg) {
      throw new Error("Paket bulunamadı");
    }

    // Business rule: Only one active membership per member
    // Cancel existing active memberships
    await membershipRepository.cancelActiveMemberships(memberId);

    // Calculate end date
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + pkg.duration_in_days);

    // Create membership
    const membership = await membershipRepository.create({
      memberId,
      packageId,
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
      status: "active",
    });

    return membership;
  }

  // Renew membership
  async renewMembership(memberId, packageId) {
    // Validate member exists
    const member = await memberRepository.findById(memberId);
    if (!member) {
      throw new Error("Üye bulunamadı");
    }

    // Validate package exists
    const pkg = await packageRepository.findById(packageId);
    if (!pkg) {
      throw new Error("Paket bulunamadı");
    }

    // Cancel any existing active memberships
    await membershipRepository.cancelActiveMemberships(memberId);

    // Create new membership starting today
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + pkg.duration_in_days);

    const membership = await membershipRepository.create({
      memberId,
      packageId,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      status: "active",
    });

    return membership;
  }

  // Check and update expired memberships
  async checkAndUpdateExpiredMemberships() {
    const shouldBeExpired = await membershipRepository.findShouldBeExpired();

    const updatedMemberships = [];
    for (const membership of shouldBeExpired) {
      const updated = await membershipRepository.updateStatus(
        membership.id,
        "expired",
      );
      updatedMemberships.push(updated);
    }

    return updatedMemberships;
  }

  // Cancel membership
  async cancelMembership(membershipId) {
    const updated = await membershipRepository.updateStatus(
      membershipId,
      "cancelled",
    );

    if (!updated) {
      throw new Error("Üyelik bulunamadı");
    }

    return updated;
  }
}

module.exports = new MembershipService();
