using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElectiaCore.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedRuleEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AcademicYearId",
                table: "Rules");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AcademicYearId",
                table: "Rules",
                type: "int",
                nullable: true);
        }
    }
}
