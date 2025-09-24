using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElectiaCore.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddedRevAndMundGrades : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Grade",
                table: "CourseGrades",
                newName: "Grade1");

            migrationBuilder.AddColumn<int>(
                name: "Grade2",
                table: "CourseGrades",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Grade3",
                table: "CourseGrades",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Grade2",
                table: "CourseGrades");

            migrationBuilder.DropColumn(
                name: "Grade3",
                table: "CourseGrades");

            migrationBuilder.RenameColumn(
                name: "Grade1",
                table: "CourseGrades",
                newName: "Grade");
        }
    }
}
