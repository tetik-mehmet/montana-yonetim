const memberRepository = require("../repositories/memberRepository");

class MemberService {
  // Get all members
  async getAllMembers() {
    return await memberRepository.findAll();
  }

  // Get member by id
  async getMemberById(id) {
    const member = await memberRepository.findById(id);

    if (!member) {
      throw new Error("Üye bulunamadı");
    }

    return member;
  }

  // Create new member
  async createMember(memberData) {
    // Validate input
    const { firstName, lastName, email } = memberData;

    if (!firstName || !lastName || !email) {
      throw new Error("Tüm alanlar zorunludur");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Geçerli bir e-posta adresi giriniz");
    }

    // Check if email already exists
    const emailExists = await memberRepository.emailExists(email);
    if (emailExists) {
      throw new Error("Bu e-posta adresi zaten kayıtlı");
    }

    // Create member
    return await memberRepository.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
    });
  }

  // Update member
  async updateMember(id, memberData) {
    // Check if member exists
    const existingMember = await memberRepository.findById(id);
    if (!existingMember) {
      throw new Error("Üye bulunamadı");
    }

    // Validate input
    const { firstName, lastName, email } = memberData;

    if (!firstName || !lastName || !email) {
      throw new Error("Tüm alanlar zorunludur");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Geçerli bir e-posta adresi giriniz");
    }

    // Check if email already exists (excluding current member)
    const emailExists = await memberRepository.emailExists(email, id);
    if (emailExists) {
      throw new Error(
        "Bu e-posta adresi başka bir üye tarafından kullanılıyor",
      );
    }

    // Update member
    return await memberRepository.update(id, {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
    });
  }

  // Delete member
  async deleteMember(id) {
    const member = await memberRepository.findById(id);

    if (!member) {
      throw new Error("Üye bulunamadı");
    }

    // Delete member (memberships will be cascade deleted)
    return await memberRepository.delete(id);
  }
}

module.exports = new MemberService();
