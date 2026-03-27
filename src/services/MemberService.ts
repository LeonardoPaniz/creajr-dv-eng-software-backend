import { Injectable } from "@nestjs/common";
import bcrypt from "bcryptjs";
import { MemberRepository } from "../repositories/MemberRepository";
import { Member } from "../models/member";
import { MemberProfileDto } from "../dto/members/member-profile.dto";

@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository) {}

  async getAllMembers() {
    return this.memberRepository.findAll();
  }

  async getMemberById(id: string) {
    const member = await this.memberRepository.findByIdWithRelations(id);
    if (!member) throw new Error("Member not found");
    return member;
  }

  async getMemberByEmail(email: string) {
    const member = await this.memberRepository.findByEmail(email);
    if (!member) throw new Error("Member not found");
    return member;
  }

  async getMembersBySponsor(sponsorId: string) {
    const members = await this.memberRepository.findBySponsor(sponsorId);
    if (members.length === 0)
      throw new Error("No members found with this sponsor");
    return members;
  }

  async getMemberBySlug(slug: string): Promise<MemberProfileDto> {
    const member = await this.memberRepository.findByNameSlug(slug);
    if (!member) throw new Error("Member not found");

    let sponsor = null;
    if (member.sponsor) {
      const sponsorMember = await this.memberRepository.findById(
        member.sponsor,
      );
      sponsor = sponsorMember
        ? {
            id: sponsorMember.id,
            name: sponsorMember.name,
            profile_picture_url: sponsorMember.profile_picture_url,
          }
        : null;
    }

    let courseData;
    let universityData;
    if (member.memberCourses && member.memberCourses.length > 0) {
      const active = member.memberCourses.find(
        (mc) => mc.status === "active",
      );
      const chosen = active || member.memberCourses[0];
      if (chosen && chosen.courseUniversity) {
        const cu = chosen.courseUniversity;
        courseData = cu.course
          ? { id: cu.course.id, name: cu.course.name }
          : undefined;
        universityData = cu.university
          ? { id: cu.university.id, name: cu.university.name }
          : undefined;
      }
    }

    const profileDto: MemberProfileDto = {
      id: member.id,
      name: member.name,
      phone: member.phone,
      ra: member.ra,
      profile_picture_url: member.profile_picture_url,
      birth_date: member.birth_date,
      admission_date: member.admission_date,
      biography: member.biography,
      banner_url: member.banner_url,
      curriculum_url: member.curriculum_url,
      youtube_url: member.youtube_url,
      twitter_url: member.twitter_url,
      instagram_url: member.instagram_url,
      linkedin_url: member.linkedin_url,
      github_url: member.github_url,
      course: courseData,
      city: member.city
        ? {
            id: member.city.id,
            name: member.city.name,
          }
        : undefined,
      university: universityData,
      sponsor: sponsor || undefined,
      roles:
        member.roles?.map((role) => ({
          id: role.id,
          name: role.name,
          description: role.description,
        })) || undefined,
    };

    return profileDto;
  }

  async createMember(memberData: any, password: string) {
    const normalizedData = {
      ...memberData,
      cpf: memberData.cpf.replace(/\D/g, ""),
      birth_date: new Date(memberData.birth_date),
      admission_date: new Date(memberData.admission_date),
      ra: String(memberData.ra),
      position: memberData.position || "Membro",
      biography: memberData.biography || null,
    };

    const existing = await this.memberRepository.existsByEmailOrCpfOrRa(
      normalizedData.email_personal,
      normalizedData.email_university,
      normalizedData.cpf,
      normalizedData.ra,
    );

    if (existing) throw new Error("CPF, RA ou email já cadastrados");

    let sponsorId = null;
    if (memberData.sponsor) {
      const sponsorMember = await this.memberRepository.findByName(
        memberData.sponsor,
      );
      sponsorId = sponsorMember?.id || null;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newMember = await this.memberRepository.create({
      ...normalizedData,
      password: hashedPassword,
      sponsor: sponsorId,
    });

    if (memberData.course_university_id) {
      await this.memberRepository.addCourseToMember(
        newMember.id,
        memberData.course_university_id,
        normalizedData.admission_date,
      );
    }

    const { password: _, ...safeMemberData } = newMember;
    return safeMemberData;
  }

  async updateMember(id: string, updateData: Partial<Member> & { course_university_id?: string }) {
    const existingMember = await this.memberRepository.findById(id);
    if (!existingMember) throw new Error("Member not found");

    if (updateData.course_university_id) {
      await this.memberRepository.addCourseToMember(
        id,
        updateData.course_university_id,
      );
      delete updateData.course_university_id;
    }

    return this.memberRepository.update(id, updateData);
  }

  async getMemberRolesAndPermissions(id: string) {
    const member =
      await this.memberRepository.findByIdWithRolesAndPermissions(id);
    if (!member) throw new Error("Member not found");

    return {
      memberId: member.id,
      memberName: member.name,
      roles:
        member.roles?.map((role) => ({
          id: role.id,
          name: role.name,
          description: role.description,
          permissions:
            role.permissions?.map((perm) => ({
              id: perm.id,
              name: perm.name,
              description: perm.description,
            })) || [],
        })) || [],
    };
  }
}
