using ElectiaCore.Application.DTOs;
using ElectiaCore.Application.Interfaces;
using ElectiaCore.Domain.Entities;
using ElectiaCore.Domain.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ElectiaCore.Application.Services
{
    public class RuleService : IRuleService
    {
        private readonly IRuleRepository _ruleRepository;

        public RuleService(IRuleRepository ruleRepository)
        {
            _ruleRepository = ruleRepository;
        }

        public async Task<Rule> GetRuleAsync(int id)
        {
            return await _ruleRepository.GetRuleAsync(id);
        }

        public async Task<IEnumerable<Rule>> GetAllRulesAsync()
        {
            return await _ruleRepository.GetAllRulesAsync();
        }

        public async Task<IEnumerable<RuleDto>> GetRulesByCourseInstanceAsync(int courseInstanceId)
        {
            var allRules = await _ruleRepository.GetAllRulesAsync();

            if (allRules == null || !allRules.Any())
            {
                return Enumerable.Empty<RuleDto>();
            }

            var rulesDto = allRules
                .Where(r => r.CourseInstanceId == courseInstanceId)
                .Select(r => new RuleDto
                {
                    Id = r.Id,
                    MajorId = r.MajorId,
                    AcademicYear = r.AcademicYear,
                    Priority = r.Priority
                }).ToList();

            return rulesDto;
        }

        public async Task AddRuleAsync(CreateRuleDto rule)
        {
            var newRule = new Rule
            {
                CourseInstanceId = rule.CourseInstanceId,
                MajorId = rule.MajorId,
                AcademicYear = rule.AcademicYear.HasValue ? (AcademicYear)rule.AcademicYear.Value : null,
                Priority = rule.Priority,
                IsDeleted = false
            };

            await _ruleRepository.AddRuleAsync(newRule);
        }

        public async Task UpdateRuleAsync(Rule rule)
        {
            await _ruleRepository.UpdateRuleAsync(rule);
        }

        public async Task DeleteRuleAsync(int id)
        {
            await _ruleRepository.DeleteRuleAsync(id);
        }
    }
}
