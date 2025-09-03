package utils

import (
	"fmt"
	"log"
	"os/exec"
	"time"
)

// GitCommitAndPush commits changes and pushes to remote
func GitCommitAndPush() error {
	// Check if git repo
	if err := runCommand("git", "status"); err != nil {
		return fmt.Errorf("not a git repository")
	}

	// Add all files
	if err := runCommand("git", "add", "."); err != nil {
		return fmt.Errorf("failed to add files: %v", err)
	}

	// Check if there are changes
	if err := runCommand("git", "diff", "--cached", "--quiet"); err == nil {
		// No changes
		log.Println("No changes to commit")
		return nil
	}

	// Commit
	commitMsg := fmt.Sprintf("Update book list - %s", time.Now().Format("02/01/2006 15:04:05"))
	if err := runCommand("git", "commit", "-m", commitMsg); err != nil {
		return fmt.Errorf("failed to commit: %v", err)
	}

	// Push
	if err := runCommand("git", "push"); err != nil {
		return fmt.Errorf("failed to push: %v", err)
	}

	log.Println("Successfully committed and pushed")
	return nil
}

// runCommand executes a command and returns error if failed
func runCommand(name string, args ...string) error {
	cmd := exec.Command(name, args...)
	return cmd.Run()
}