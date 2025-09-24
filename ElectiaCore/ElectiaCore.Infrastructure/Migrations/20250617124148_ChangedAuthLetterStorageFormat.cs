using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElectiaCore.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ChangedAuthLetterStorageFormat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AuthorizationLetterPath",
                table: "Courses");

            migrationBuilder.AddColumn<byte[]>(
                name: "AuthorizationLetterData",
                table: "Courses",
                type: "varbinary(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AuthorizationLetterData",
                table: "Courses");

            migrationBuilder.AddColumn<string>(
                name: "AuthorizationLetterPath",
                table: "Courses",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
