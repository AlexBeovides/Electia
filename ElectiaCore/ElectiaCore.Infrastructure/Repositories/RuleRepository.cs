using ElectiaCore.Domain.Entities;
using ElectiaCore.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ElectiaCore.Infrastructure.Repositories
{
    public class RuleRepository : IRuleRepository
    {
        private readonly ElectiaDbContext _context;

        public RuleRepository(ElectiaDbContext context)
        {
            _context = context;
        }

        public async Task<Rule> GetRuleAsync(int id)
        {
            var rule = await _context.Rules.FirstOrDefaultAsync(r => r.Id == id);

            if (rule == null)
            {
                throw new KeyNotFoundException("Rule not found");
            }
            return rule;
        }

        public async Task<IEnumerable<Rule>> GetAllRulesAsync()
        {
            return await _context.Set<Rule>()
                .Where(r => !r.IsDeleted)
                .ToListAsync();
        }

        public async Task AddRuleAsync(Rule rule)
        {
            await _context.Set<Rule>().AddAsync(rule);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateRuleAsync(Rule rule)
        {
            _context.Set<Rule>().Update(rule);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteRuleAsync(int id)
        {
            var rule = await GetRuleAsync(id);
            rule.IsDeleted = true;
            await _context.SaveChangesAsync();
        }
    }
}
