using Talent.Common.Contracts;
using Talent.Common.Models;
using Talent.Services.Profile.Domain.Contracts;
using Talent.Services.Profile.Models.Profile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Bson;
using Talent.Services.Profile.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using Talent.Common.Security;

namespace Talent.Services.Profile.Domain.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IUserAppContext _userAppContext;
        IRepository<UserLanguage> _userLanguageRepository;
        IRepository<UserSkill> _userSkillRepository;
        IRepository<UserExperience> _userExperienceRepository;
        IRepository<UserEducation> _userEducationRepository;
        IRepository<UserCertification> _userCertificationRepository;
        IRepository<User> _userRepository;        
        IRepository<Employer> _employerRepository;
        IRepository<Job> _jobRepository;
        IRepository<Recruiter> _recruiterRepository;
        IFileService _fileService;


        public ProfileService(IUserAppContext userAppContext,
                              IRepository<UserLanguage> userLanguageRepository,
                              IRepository<UserSkill> userSkillRepository,
                              IRepository<UserExperience> userExperienceRepository,
                              IRepository<UserEducation> userEducationRepository,
                              IRepository<UserCertification> userCertificationRepository,
                              IRepository<User> userRepository,
                              IRepository<Employer> employerRepository,
                              IRepository<Job> jobRepository,
                              IRepository<Recruiter> recruiterRepository,
                              IFileService fileService)
        {
            _userAppContext = userAppContext;
            _userSkillRepository = userSkillRepository;
            _userLanguageRepository = userLanguageRepository;
            _userExperienceRepository = userExperienceRepository;
            _userRepository = userRepository;
            _employerRepository = employerRepository;
            _jobRepository = jobRepository;
            _recruiterRepository = recruiterRepository;
            _fileService = fileService;
        }

        public async Task<bool> AddNewLanguage(AddLanguageViewModel language)
        {      
            try
            {
                var lan = new UserLanguage
                {
                    Id = ObjectId.GenerateNewId().ToString(),
                    UserId = _userAppContext.CurrentUserId,
                    IsDeleted = false               
                };
                UpdateLanguageFromView(language, lan);
                
                await _userLanguageRepository.Add(lan);
                return true;
            }
            catch (MongoException e)
            {
                return false;
            }
        }
        public async Task<bool> AddNewSkill(AddSkillViewModel skill)
        {
            try
            {
                var sk = new UserSkill
                {
                    Id = ObjectId.GenerateNewId().ToString(),
                    UserId = _userAppContext.CurrentUserId,
                    IsDeleted = false
                };
                UpdateSkillFromView(skill, sk);

                await _userSkillRepository.Add(sk);
                return true;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<bool> AddNewExperience(AddExperienceViewModel experience)
        {
            try
            {
                var exp = new UserExperience
                {
                    Id = ObjectId.GenerateNewId().ToString(),                   
                    IsDeleted = false
                };
                UpdateExperienceFromView(experience, exp);

                await _userExperienceRepository.Add(exp);
                return true;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public Task<bool> AddNewEducation(AddEducationViewModel education)
        {
            throw new NotImplementedException();
        }

        public Task<bool> AddNewCertification(AddCertificationViewModel certification)
        {
            throw new NotImplementedException();
        }

        public async Task<TalentProfileViewModel> GetTalentProfile(string Id)
        {
            User profile = (await _userRepository.GetByIdAsync(Id));
            var videoUrl = "";
            var photoUrl = "";
            if (profile != null)
            {
                videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                         ? ""
                         : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);
                photoUrl = string.IsNullOrWhiteSpace(profile.ProfilePhoto) ? ""
                           : await _fileService.GetFileURL(profile.ProfilePhotoUrl, FileType.ProfilePhoto);
                var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();
                var lans = profile.Languages.Select(x => ViewModelFromLanguage(x)).ToList();
                var certs = profile.Certifications.Select(x => ViewModelFromCert(x)).ToList();
                var edus = profile.Education.Select(x => ViewModelFromEducation(x)).ToList();
                var exps = profile.Experience.Select(x => ViewModelFromExperience(x)).ToList();

                var result = new TalentProfileViewModel
                {
                    Id = profile.Id,
                    FirstName = profile.FirstName,
                    LastName = profile.LastName,
                    Email = profile.Email,                    
                    VideoName = profile.VideoName,
                    CvName = profile.CvName,
                    Summary = profile.Summary,
                    Phone = profile.Phone,
                    Address = profile.Address,
                    Nationality = profile.Nationality,                   
                    Description = profile.Description,
                    VisaStatus = profile.VisaStatus,
                    VisaExpiryDate = profile.VisaExpiryDate,
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = profile.ProfilePhotoUrl,
                    LinkedAccounts = profile.LinkedAccounts,
                    JobSeekingStatus = profile.JobSeekingStatus,
                    Skills = skills,
                    Languages = lans,
                    Certifications = certs,
                    Education = edus,
                    Experience = exps,
            };
                return result;
            }

            return null;
        }

        public async Task<bool> UpdateTalentProfile(TalentProfileViewModel model, string updaterId)
        {
            try
            {
                if (updaterId != null)
                {
                    User user = (await _userRepository.GetByIdAsync(updaterId));
                    user.FirstName = model.FirstName;
                    user.LastName = model.LastName;
                    user.Email = model.Email;
                  //  user.CvName = model.CvName;
                    user.Phone = model.Phone;
                   // user.MobilePhone = model.MobilePhone;
                   // user.IsMobilePhoneVerified = model.IsMobilePhoneVerified;
                   // user.Gender = model.Gender;                    
                    user.Address = model.Address;
                    user.Nationality = model.Nationality;
                    user.Description = model.Description;
                    user.Summary = model.Summary;
                    user.Location = null;
                //    user.MiddleName = null;
                    user.VisaStatus = model.VisaStatus;
                    user.VisaExpiryDate = model.VisaExpiryDate;
                    //user.VideoName = model.VideoName;
                    //user.Videos = null;
                    user.ProfilePhoto = model.ProfilePhoto;
                    user.ProfilePhotoUrl = model.ProfilePhotoUrl;
                    user.LinkedAccounts = model.LinkedAccounts;
                    user.JobSeekingStatus = model.JobSeekingStatus;
                    user.UpdatedBy = updaterId;
                    user.UpdatedOn = DateTime.Now;

                    var newSkills = new List<UserSkill>();
                    foreach (var item in model.Skills)
                    {
                        var skill = user.Skills.SingleOrDefault(x => x.Id == item.Id);
                        if (skill == null)
                        {
                            skill = new UserSkill
                            {
                                Id = ObjectId.GenerateNewId().ToString(),
                                UserId = _userAppContext.CurrentUserId,
                                IsDeleted = false
                            };
                        }
                        UpdateSkillFromView(item, skill);
                        newSkills.Add(skill);
                    }
                    user.Skills = newSkills;

                    var newLans = new List<UserLanguage>();
                    foreach (var item in model.Languages)
                    {
                        var lan = user.Languages.SingleOrDefault(x => x.Id == item.Id);
                        if (lan == null)
                        {
                            lan = new UserLanguage
                            {
                                Id = ObjectId.GenerateNewId().ToString(),
                                UserId = _userAppContext.CurrentUserId,
                                IsDeleted = false
                            };
                        }
                        UpdateLanguageFromView(item, lan);
                        newLans.Add(lan);
                    }
                    user.Languages = newLans;

                    var newExps = new List<UserExperience>();
                    foreach (var item in model.Experience)
                    {
                        var exp = user.Experience.SingleOrDefault(x => x.Id == item.Id);
                        if (exp == null)
                        {
                            exp = new UserExperience
                            {
                                Id = ObjectId.GenerateNewId().ToString(),                                
                                IsDeleted = false
                            };                            
                        }
                        UpdateExperienceFromView(item, exp);
                        newExps.Add(exp);
                    }
                    user.Experience = newExps;

                    //var newCerts = new List<UserCertification>();
                    //foreach (var item in model.Certifications)
                    //{
                    //    var cert = user.Certifications.SingleOrDefault(x => x.Id == item.Id);
                    //    if (cert == null)
                    //    {
                    //        cert = new UserCertification
                    //        {
                    //            Id = ObjectId.GenerateNewId().ToString(),
                    //            IsDeleted = false
                    //        };
                    //    }
                    //    UpdateCertificationFromView(item, cert);
                    //    newCerts.Add(cert);
                    //}
                    //user.Certifications = newCerts;

                    //var newEdus = new List<UserEducation>();
                    //foreach (var item in model.Education)
                    //{
                    //    var edu = user.Education.SingleOrDefault(x => x.Id == item.Id);
                    //    if (edu == null)
                    //    {
                    //        edu = new UserEducation
                    //        {
                    //            Id = ObjectId.GenerateNewId().ToString(),
                    //            IsDeleted = false
                    //        };
                    //    }
                    //    UpdateEducationFromView(item, edu);
                    //    newEdus.Add(edu);
                    //}
                    //user.Education = newEdus;
                    Console.WriteLine(user);
                    await _userRepository.Update(user);
                    return true;
                }
                return false;
            }   
        
            catch (MongoException e)
            {
                Console.WriteLine(e.Data);
                return false;
            }
        }
        public async Task<EmployerProfileViewModel> GetEmployerProfile(string Id, string role)
        {

            Employer profile = null;
            switch (role)
            {
                case "employer":
                    profile = (await _employerRepository.GetByIdAsync(Id));
                    break;
                case "recruiter":
                    profile = (await _recruiterRepository.GetByIdAsync(Id));
                    break;
            }

            var videoUrl = "";

            if (profile != null)
            {
                videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);

                var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();

                var result = new EmployerProfileViewModel
                {
                    Id = profile.Id,
                    CompanyContact = profile.CompanyContact,
                    PrimaryContact = profile.PrimaryContact,
                    Skills = skills,
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = profile.ProfilePhotoUrl,
                    VideoName = profile.VideoName,
                    VideoUrl = videoUrl,
                    DisplayProfile = profile.DisplayProfile,
                };
                return result;
            }

            return null;
        }

        public async Task<bool> UpdateEmployerProfile(EmployerProfileViewModel employer, string updaterId, string role)
        {
            try
            {
                if (employer.Id != null)
                {
                    switch (role)
                    {
                        case "employer":
                            Employer existingEmployer = (await _employerRepository.GetByIdAsync(employer.Id));
                            existingEmployer.CompanyContact = employer.CompanyContact;
                            existingEmployer.PrimaryContact = employer.PrimaryContact;
                            existingEmployer.ProfilePhoto = employer.ProfilePhoto;
                            existingEmployer.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingEmployer.DisplayProfile = employer.DisplayProfile;
                            existingEmployer.UpdatedBy = updaterId;
                            existingEmployer.UpdatedOn = DateTime.Now;

                            var newSkills = new List<UserSkill>(); //new middle var [List]
                            foreach (var item in employer.Skills) //each item in para sending {obj}
                            {
                                var skill = existingEmployer.Skills.SingleOrDefault(x => x.Id == item.Id); //find each existing data
                                if (skill == null) //if cannot find such data
                                {
                                    skill = new UserSkill //create a new obj
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),  //create a new id
                                        IsDeleted = false //set the deleted tag to be false
                                    };
                                }
                                UpdateSkillFromView(item, skill); //assign each item of para sending data to each existing data
                                newSkills.Add(skill);  //feed each revised data to the middle var
                            }
                            existingEmployer.Skills = newSkills; //substitute the existing props with the middle var

                            await _employerRepository.Update(existingEmployer); //update after substitution
                            break;

                        case "recruiter":
                            Recruiter existingRecruiter = (await _recruiterRepository.GetByIdAsync(employer.Id));
                            existingRecruiter.CompanyContact = employer.CompanyContact;
                            existingRecruiter.PrimaryContact = employer.PrimaryContact;
                            existingRecruiter.ProfilePhoto = employer.ProfilePhoto;
                            existingRecruiter.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingRecruiter.DisplayProfile = employer.DisplayProfile;
                            existingRecruiter.UpdatedBy = updaterId;
                            existingRecruiter.UpdatedOn = DateTime.Now;

                            var newRSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingRecruiter.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newRSkills.Add(skill);
                            }
                            existingRecruiter.Skills = newRSkills;
                            await _recruiterRepository.Update(existingRecruiter);

                            break;
                    }
                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateEmployerPhoto(string employerId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _employerRepository.Get(x => x.Id == employerId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _employerRepository.Update(profile);
                return true;
            }

            return false;

        }

        public async Task<bool> AddEmployerVideo(string employerId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _employerRepository.Get(x => x.Id == employerId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _employerRepository.Update(profile);
                return true;
            }

            return false;
        }

        public async Task<bool> UpdateTalentPhoto(string talentId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _userRepository.Get(x => x.Id == talentId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _userRepository.Update(profile);
                return true;
            }

            return false;
        }

        public async Task<bool> AddTalentVideo(string talentId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _userRepository.Get(x => x.Id == talentId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _userRepository.Update(profile);
                return true;
            }
            return false;
        }

        public async Task<bool> RemoveTalentVideo(string talentId, string videoName)
        {
            var profile = (await _userRepository.Get(x => x.Id == talentId)).SingleOrDefault();
            if (profile == null)
            {
                return false;
            }
            if (!string.IsNullOrWhiteSpace(videoName))
            {
                await _fileService.DeleteFile(videoName, FileType.ProfilePhoto);
                await _userRepository.Update(profile);
                return true;
            }
            return false;
        }

        public async Task<bool> UpdateTalentCV(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<string>> GetTalentSuggestionIds(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(string employerOrJobId, bool forJob, int position, int increment)
        {
            Employer employer = await _employerRepository.GetByIdAsync(employerOrJobId);
            //return employer.TalentWatchlist;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(IEnumerable<string> ids)
        {
            var ls = new List<TalentSnapshotViewModel>();

            foreach (string i in ids)
            {
                var profile = await _userRepository.GetByIdAsync(i);
                if (profile != null) {

                    var result = new TalentSnapshotViewModel
                    {
                        Id = profile.Id,
                        Name = profile.FirstName + ' ' + profile.LastName,
                        PhotoId = profile.ProfilePhotoUrl,
                        VideoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                         ? ""
                         : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo),
                        CVUrl = profile.CvName,
                        Visa = profile.VisaStatus,
                        Skills = profile.Skills.Select(x => x.Skill).ToList(),
                        LinkedAccounts = profile.LinkedAccounts,
                        CurrentEmployment = profile.Experience.Select(x => ViewModelFromExperience(x)).FirstOrDefault().Company,
                    };
                    ls.Add(result);
                };                
            }
            return ls;
        }

        #region TalentMatching

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetFullTalentList()
        {
            List<TalentSnapshotViewModel> talents = new List<TalentSnapshotViewModel>();
            List<User> ls = (await _userRepository.FindAsync(_ => _.FirstName != null)).ToList();

            foreach (var profile in ls)
            {
                var result = new TalentSnapshotViewModel
                {
                    Id = profile.Id,
                    Name = profile.FirstName + ' ' + profile.LastName,
                    PhotoId = profile.ProfilePhotoUrl,
                    VideoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                         ? ""
                         : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo),
                    CVUrl = profile.CvName,
                    Visa = profile.VisaStatus,
                    Skills = profile.Skills.Select(x => x.Skill).ToList(),
                    LinkedAccounts = profile.LinkedAccounts,
                    CurrentEmployment = profile.Experience.OrderByDescending(s => s.End).Select(x => ViewModelFromExperience(x)).FirstOrDefault().Company,
                    Position = profile.Experience.OrderByDescending(s => s.End).Select(x => ViewModelFromExperience(x)).FirstOrDefault().Position,
                };
                talents.Add(result);
            }
            return talents;
        }


        public async Task<IEnumerable<TalentSuggestionViewModel>> GetATalentList()
        {
            IEnumerable<User> x = await _userRepository.Get(_ => true);
            List<User> talents = x.ToList();            
            List<TalentSuggestionViewModel> talentResult = new List<TalentSuggestionViewModel>();
            foreach (var talent in talents)
            {
                var experiences = talent.Experience.OrderByDescending(_ => _.End).Select(_ => ViewModelFromExperience(_ )).ToList();
                var skills = talent.Skills.Select(_ => ViewModelFromSkill(_ )).ToList();
                talentResult.Add(new TalentSuggestionViewModel
                {
                    Id = talent.Id,
                   Name = talent.FirstName + " " + talent.LastName,
                    PhotoId = talent.ProfilePhotoUrl,
                   WorkExperience = experiences,
                    Skills = skills,
                    VisaStatus = talent.VisaStatus,
                    LinkedAccounts = talent.LinkedAccounts,
                });
            }
            return talentResult;
        }

        public async Task<IEnumerable<TalentMatchingEmployerViewModel>> GetEmployerList()
        {
            IEnumerable<Employer> x = await _employerRepository.Get(_ => true);
            List<Employer> emps = x.ToList();
            List<TalentMatchingEmployerViewModel> res = new List<TalentMatchingEmployerViewModel>();
            foreach(var e in emps)
            {
                res.Add(new TalentMatchingEmployerViewModel
                {
                    Id = e.Id,
                    CompanyContact = e.CompanyContact,
                    PrimaryContact = e.PrimaryContact,
                    ProfilePhoto = e.ProfilePhoto,
                    ProfilePhotoUrl = e.ProfilePhotoUrl,
                });               
            };
            return res;
        }

        public async Task<IEnumerable<TalentMatchingEmployerViewModel>> GetEmployerListByFilterAsync(SearchCompanyModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetTalentListByFilterAsync(SearchTalentModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestion>> GetSuggestionList(string employerOrJobId, bool forJob, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> AddTalentSuggestions(AddTalentSuggestionList selectedTalents)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #endregion

        #region Conversion Methods
        #region Update from View

        protected void UpdateSkillFromView(AddSkillViewModel model, UserSkill original)
        {
            original.ExperienceLevel = model.Level;
            original.Skill = model.Name;            
        }

        protected void UpdateLanguageFromView(AddLanguageViewModel model, UserLanguage original)
        {
            original.LanguageLevel = model.Level;
            original.Language= model.Name;
        }

        protected void UpdateExperienceFromView(AddExperienceViewModel model, UserExperience original)
        {
            original.Company = model.Company;
            original.Position = model.Position;
            original.Responsibilities = model.Responsibilities;
            original.Start = model.Start;
            original.End = model.End;
        }

        protected void UpdateEducationFromView(AddEducationViewModel model, UserEducation original)
        {
            original.Country = model.Country;
            original.Degree = model.Degree;
            original.InstituteName = model.InstituteName;
            original.Title = model.Title;
            original.YearOfGraduation = model.YearOfGraduation;
        }

        protected void UpdateCertificationFromView(AddCertificationViewModel model, UserCertification original)
        {
            original.CertificationFrom = model.CertificationFrom;
            original.CertificationName = model.CertificationName;
            original.CertificationYear = model.CertificationYear;            
        }

        #endregion

        #region Build Views from Model

        protected AddSkillViewModel ViewModelFromSkill(UserSkill skill)
        {
            return new AddSkillViewModel
            {
                Id = skill.Id,
                Level = skill.ExperienceLevel,
                Name = skill.Skill
            };
        }

        protected AddLanguageViewModel ViewModelFromLanguage(UserLanguage lan)
        {
            return new AddLanguageViewModel
            {
                Id = lan.Id,
                Level = lan.LanguageLevel,
                Name = lan.Language
            };
        }

        protected AddExperienceViewModel ViewModelFromExperience(UserExperience exp)
        {
            return new AddExperienceViewModel
            {
                Id = exp.Id,
                Position = exp.Position,
                Company = exp.Company,
                Start = exp.Start,
                End = exp.End,
                Responsibilities = exp.Responsibilities
            };
        }

        protected AddEducationViewModel ViewModelFromEducation(UserEducation edu)
        {
            return new AddEducationViewModel
            {
                Id = edu.Id,
                Country = edu.Country,
                Degree = edu.Degree,
                InstituteName = edu.InstituteName,
                Title = edu.Title,   
                YearOfGraduation = edu.YearOfGraduation    
            };
        }

        protected AddCertificationViewModel ViewModelFromCert(UserCertification cert)
        {
            return new AddCertificationViewModel
            {
                Id = cert.Id,
                CertificationFrom = cert.CertificationFrom,
                CertificationName = cert.CertificationName,
                CertificationYear = cert.CertificationYear
            };
        }

        #endregion
      
        #endregion

        #region ManageClients

        public async Task<IEnumerable<ClientViewModel>> GetClientListAsync(string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<ClientViewModel> ConvertToClientsViewAsync(Client client, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }
         
        public async Task<int> GetTotalTalentsForClient(string clientId, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<Employer> GetEmployer(string employerId)
        {
            return await _employerRepository.GetByIdAsync(employerId);
        }

        
        #endregion

    }
}
